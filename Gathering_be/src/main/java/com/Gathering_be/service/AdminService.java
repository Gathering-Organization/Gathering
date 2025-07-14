package com.Gathering_be.service;

import com.Gathering_be.domain.*;
import com.Gathering_be.dto.response.MemberInfoForAdminResponse;
import com.Gathering_be.dto.response.ProjectResponseForAdmin;
import com.Gathering_be.exception.InvalidEnumValue;
import com.Gathering_be.exception.InvalidSortTypeException;
import com.Gathering_be.exception.MemberNotFoundException;
import com.Gathering_be.exception.ProjectNotFoundException;
import com.Gathering_be.global.enums.*;
import com.Gathering_be.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final MemberRepository memberRepository;
    private final ProfileRepository profileRepository;
    private final ProjectRepository projectRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationRepository notificationRepository;

    private final EmailService emailService;
    private final NotificationService notificationService;

    public List<MemberInfoForAdminResponse> getMembers() {
        List<Profile> profiles = profileRepository.findAllWithMember();
        return profiles.stream()
                .map(MemberInfoForAdminResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void changeMemberRole(Long memberId, Role newRole) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);
        member.updateRole(newRole);
    }

    public Page<ProjectResponseForAdmin> searchProjectsWithFilters(int page, int size, String sort, String position,
                                                                   String techStack, String type, String mode, Boolean isClosed,
                                                                   Boolean isDeleted, SearchType searchType, String keyword) {
        Sort sortCondition = switch (sort) {
            case "-createdAt" -> Sort.by(Sort.Order.desc("createdAt"));
            case "createdAt" -> Sort.by(Sort.Order.asc("createdAt"));
            case "viewCount" -> Sort.by(Sort.Order.desc("viewCount"));
            default -> throw new InvalidSortTypeException();
        };

        Pageable pageable = PageRequest.of(page - 1, size,sortCondition);

        JobPosition positionEnum = parseEnum(JobPosition.class, position);
        ProjectType typeEnum = parseEnum(ProjectType.class, type);
        ProjectMode modeEnum = parseEnum(ProjectMode.class, mode);
        List<TechStack> techStacks = (techStack != null && !techStack.isEmpty())
                ? Arrays.stream(techStack.split(",")).map(TechStack::valueOf).collect(Collectors.toList())
                : null;

        Page<Project> projectPage = projectRepository.searchProjectsForAdmin(
                pageable, positionEnum, techStacks, typeEnum, modeEnum, isClosed, isDeleted, searchType, keyword
        );

        return projectPage
                .map(project -> ProjectResponseForAdmin.from(project, false, null));
    }

    @Transactional
    public void deleteProject(Long projectId) {
        Project project = getProjectByIdForUpdate(projectId);

        if (project.isDeleted()) {
            return;
        }

        Profile authorProfile = project.getProfile();
        String projectTitle = project.getTitle();

        // 모집자에게 이메일 전송
        emailService.sendProjectDeletetionNotice(
                authorProfile.getMember().getEmail(), projectTitle, authorProfile.getNickname());

        // 모집자에게 알림 전송
        Notification authorNotification = Notification.builder()
                .receiver(authorProfile)
                .content("관리자에 의해 '" + projectTitle + "' 모집글이 삭제되었습니다.")
                .notificationType(NotificationType.PROJECT_DELETED)
                .relatedUrl("")
                .build();
        notificationRepository.save(authorNotification);
        notificationService.send(authorNotification);

        // 지원자들에게 이메일 및 알림 전송
        Map<String, String> applicants = new HashMap<>();
        List<Application> applications = applicationRepository.findAllByProjectId(projectId);

        for (Application application : applications) {
            Profile applicantProfile = application.getProfileFromSnapshot();

            if (applicantProfile != null) {
                // 이메일 발송 목록에 추가
                applicants.put(applicantProfile.getMember().getEmail(), applicantProfile.getNickname());

                // 지원자의 프로필 카운트 조정
                applicantProfile.removeApplication(application.getStatus());
            }

            // 지원서 상태 변경
            application.updateStatus(ApplyStatus.CANCELED);

            // 지원자에게 실시간 알림 전송
            Notification applicantNotification = Notification.builder()
                    .receiver(applicantProfile)
                    .content("지원하셨던 '" + projectTitle + "' 모집글이 관리자에 의해 삭제되었습니다.")
                    .notificationType(NotificationType.PROJECT_DELETED)
                    .relatedUrl("")
                    .build();
            notificationRepository.save(applicantNotification);
            notificationService.send(applicantNotification);
        }

        // 지원자들에게 이메일 전송
        if (!applicants.isEmpty()) {
            emailService.sendProjectDeletionNotice(applicants, project.getTitle());
        }

        // 모집자의 프로필 카운트 조정 및 프로젝트 삭제
        authorProfile.removeProject(project.isClosed());
        project.delete();
    }

    @Transactional(readOnly = true)
    public long getMemberCount() {
        return memberRepository.count();
    }

    private Project getProjectByIdForUpdate(Long projectId) {
        return projectRepository.findByIdIncludeDeleted(projectId)
                .orElseThrow(ProjectNotFoundException::new);
    }

    private <E extends Enum<E>> E parseEnum(Class<E> enumClass, String value) {
        if (value == null || "ALL".equalsIgnoreCase(value)) {
            return null;
        }
        try {
            return Enum.valueOf(enumClass, value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidEnumValue();
        }
    }
}