package com.Gathering_be.service;

import com.Gathering_be.domain.Application;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.domain.Project;
import com.Gathering_be.domain.ProjectTeams;
import com.Gathering_be.dto.request.ProjectCreateRequest;
import com.Gathering_be.dto.request.ProjectUpdateRequest;
import com.Gathering_be.dto.response.ProjectDetailResponse;
import com.Gathering_be.dto.response.ProjectSimpleResponse;
import com.Gathering_be.exception.*;
import com.Gathering_be.global.enums.*;
import com.Gathering_be.global.service.S3Service;
import com.Gathering_be.repository.ApplicationRepository;
import com.Gathering_be.repository.InterestProjectRepository;
import com.Gathering_be.repository.ProfileRepository;
import com.Gathering_be.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProfileRepository profileRepository;
    private final ProjectRepository projectRepository;
    private final InterestProjectRepository interestProjectRepository;
    private final ApplicationRepository applicationRepository;
    private final RedisService redisService;
    private final S3Service s3Service;
    private final EmailService emailService;

    @Transactional
    public ProjectDetailResponse createProject(ProjectCreateRequest request) {
        Long memberId = getCurrentUserId();
        Profile profile = findProfileByMemberId(memberId);
        profile.addProject();

        Project project = Project.builder()
                .profile(profile)
                .title(request.getTitle())
                .description(request.getDescription())
                .kakaoUrl(request.getKakaoUrl())
                .projectType(request.getProjectType())
                .projectMode(request.getProjectMode())
                .totalMembers(request.getTotalMembers())
                .duration(request.getDuration())
                .deadline(request.getDeadline())
                .startDate(request.getStartDate())
                .techStacks(request.getTechStacks())
                .requiredPositions(request.getRequiredPositions())
                .build();

        Set<ProjectTeams> projectTeams = createProjectTeams(project, request.getTeams());
        project.getTeams().addAll(projectTeams);

        Project savedProject = projectRepository.save(project);
        return ProjectDetailResponse.from(savedProject, false, s3Service, false, null);
    }

    @Transactional
    public void updateProject(Long projectId, ProjectUpdateRequest request) {
        Project project = findProjectById(projectId);
        validateMemberAccess(project);

        project.update(request);

        Set<ProjectTeams> updatedProjectTeams = createProjectTeams(project, request.getTeams());
        project.getTeams().clear();
        project.getTeams().addAll(updatedProjectTeams);
    }

    @Transactional
    public void deleteProject(Long projectId) {
        Project project = findProjectById(projectId);
        validateMemberAccess(project);

        project.getProfile().removeProject(project.isClosed());
        projectRepository.deleteById(projectId);
    }

    public ProjectDetailResponse getProjectById(Long projectId) {
        Long memberId = getCurrentUserId();
        incrementViewCount(projectId, memberId);

        Project project =  projectRepository.findById(projectId)
                .orElseThrow(ProjectNotFoundException::new);

        boolean isInterested = isUserInterestedInProject(projectId);

        Profile profile = profileRepository.findByMemberId(memberId)
                .orElseThrow(ProfileNotFoundException::new);
        boolean isApplied = false;
        ApplyStatus applyStatus = null;

        Optional<Application> application = applicationRepository.findAll().stream()
                .filter(app -> app.getProject().getId().equals(projectId))
                .filter(app -> app.getProfileFromSnapshot().getId().equals(profile.getId()))
                .findFirst();

        if (application.isPresent()) {
            isApplied = true;
            applyStatus = application.get().getStatus();
        }

        return ProjectDetailResponse.from(project, isInterested, s3Service, isApplied, applyStatus);
    }

    public Page<ProjectSimpleResponse> searchProjectsWithFilters(int page, int size, String sort, String position,
                                                                 String techStack, String type, String mode, Boolean isClosed,
                                                                 SearchType searchType, String keyword) {
        Long currentUserId = getCurrentUserId();
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

        Page<Project> projectPage = projectRepository.searchProjectsWithFilters(
                pageable, positionEnum, techStacks, typeEnum, modeEnum, isClosed, searchType, keyword
        );

        Set<Long> interestedProjectIds = (currentUserId != null)
                ? interestProjectRepository.findAllByProfileId(getProfileIdByMemberId(currentUserId))
                .stream()
                .map(interest -> interest.getProject().getId())
                .collect(Collectors.toSet())
                : Set.of();

        return projectPage
                .map(project -> ProjectSimpleResponse.from(project, interestedProjectIds.contains(project.getId()), null));
    }

    public Page<ProjectSimpleResponse> getProjectsByNickname(String nickname, int page, int size, Boolean isClosed) {
        Long currentUserId = getCurrentUserId();
        validateMemberAccess(currentUserId, nickname);

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Order.desc("createdAt")));

        Page<Project> projectPage;
        if (isClosed == null) {
            projectPage = projectRepository.findAllByProfileNickname(nickname, pageable);
        } else {
            projectPage = projectRepository.findAllByProfileNicknameAndIsClosed(nickname, isClosed, pageable);
        }

        Set<Long> interestedProjectIds = (currentUserId != null)
                ? interestProjectRepository.findAllByProfileId(getProfileIdByMemberId(currentUserId))
                .stream()
                .map(interest -> interest.getProject().getId())
                .collect(Collectors.toSet())
                : Set.of();

        return projectPage
                .map(project -> ProjectSimpleResponse.from(project, interestedProjectIds.contains(project.getId()), null));
    }

    @Transactional
    public void toggleProjectRecruitment(Long projectId) {
        Project project = findProjectById(projectId);
        validateMemberAccess(project);

        project.toggleIsClosed();
        project.getProfile().toggleProjectStatus(project.isClosed());
    }
      
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void closeExpiredProjects() {
        LocalDateTime now = LocalDateTime.now();

        List<Project> expiredProjects = projectRepository.findAllByDeadlineBeforeAndIsClosedFalse(now);

        for (Project project : expiredProjects) {
            project.closeProject();

            List<Application> applications = applicationRepository.findAllByProjectAndStatus(project, ApplyStatus.PENDING);
            for (Application application : applications) {
                application.reject();
                Profile applicantProfile = application.getProfileFromSnapshot();
                String email = applicantProfile.getMember().getEmail();
                String nickname = applicantProfile.getNickname();
                emailService.sendCloseMail(email, project.getTitle(), nickname);
            }
        }
    }


    private void validateMemberAccess(Project project) {
        Long currentUserId = getCurrentUserId();
        if (!project.getProfile().getMember().getId().equals(currentUserId)) {
            throw new UnauthorizedAccessException();
        }
    }

    private void validateMemberAccess(Long currentUserId, String nickname) {
        Profile profile = findProfileByMemberId(currentUserId);
        if (!profile.getNickname().equals(nickname)) {
            throw new UnauthorizedAccessException();
        }
    }

    private Project findProjectById(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(ProjectNotFoundException::new);
    }

    private Profile findProfileByMemberId(Long memberId) {
        return profileRepository.findByMemberId(memberId)
                .orElseThrow(ProfileNotFoundException::new);
    }

    private Set<Profile> findProfilesByNicknames(Set<String> teamNicknames) {
        List<Profile> profiles = profileRepository.findAllByNicknameIn(teamNicknames);
        if (profiles.size() != teamNicknames.size()) {
            throw new ProfileNotFoundException();
        }
        return new HashSet<>(profiles);
    }

    private Set<ProjectTeams> createProjectTeams(Project project, Set<String> teamNicknames) {
        Set<Profile> teamProfiles = findProfilesByNicknames(teamNicknames);

        return teamProfiles.stream()
                .map(profile -> ProjectTeams.builder().profile(profile).project(project).build())
                .collect(Collectors.toSet());
    }

    private boolean isUserInterestedInProject(Long projectId) {
        return isUserInterestedInProject(getCurrentUserId(), projectId);
    }

    private boolean isUserInterestedInProject(Long userId, Long projectId) {
        if (userId == null) {
            return false;
        }
        Profile profile = profileRepository.findByMemberId(userId)
                .orElseThrow(ProfileNotFoundException::new);
        return interestProjectRepository.existsByProfileIdAndProjectId(profile.getId(), projectId);
    }

    private Long getCurrentUserId() {
        String principal = SecurityContextHolder.getContext().getAuthentication().getName();
        if ("anonymousUser".equals(principal)) {
            return null;
        }
        return Long.parseLong(principal);
    }

    private Long getProfileIdByMemberId(Long memberId) {
        Profile profile = profileRepository.findByMemberId(memberId)
                .orElseThrow(ProfileNotFoundException::new);
        return profile.getId();
    }

    @Transactional
    private void incrementViewCount(Long projectId, Long memberId) {
        String redisKey = "project:view:" + projectId + ":" + memberId;
        if (redisService.getValues(redisKey) == null) {
            Project project = projectRepository.findById(projectId)
                    .orElseThrow(ProjectNotFoundException::new);

            project.incrementViewCount();
            projectRepository.save(project);

            redisService.setValues(redisKey, "viewed", Duration.ofSeconds(1));
        }
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
