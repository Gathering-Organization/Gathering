package com.Gathering_be.service;

import com.Gathering_be.domain.Member;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.domain.Project;
import com.Gathering_be.dto.response.MemberInfoForAdminResponse;
import com.Gathering_be.dto.response.ProjectResponseForAdmin;
import com.Gathering_be.exception.InvalidEnumValue;
import com.Gathering_be.exception.InvalidSortTypeException;
import com.Gathering_be.exception.MemberNotFoundException;
import com.Gathering_be.exception.ProjectNotFoundException;
import com.Gathering_be.global.enums.*;
import com.Gathering_be.repository.MemberRepository;
import com.Gathering_be.repository.ProfileRepository;
import com.Gathering_be.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final MemberRepository memberRepository;
    private final ProfileRepository profileRepository;
    private final ProjectRepository projectRepository;

    public Page<MemberInfoForAdminResponse> findMembers(Pageable pageable) {
        Page<Profile> profiles = profileRepository.findAllWithMember(pageable);
        return profiles.map(MemberInfoForAdminResponse::from);
    }

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

//        if (applicationRepository.existsByProjectId(projectId)){
//            throw new ProjectHasApplicantsException();
//        }

        project.getProfile().removeProject(project.isClosed());
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