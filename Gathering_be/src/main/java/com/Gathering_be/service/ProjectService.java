package com.Gathering_be.service;

import com.Gathering_be.domain.Profile;
import com.Gathering_be.domain.Project;
import com.Gathering_be.domain.ProjectTeams;
import com.Gathering_be.dto.request.ProjectCreateRequest;
import com.Gathering_be.dto.request.ProjectUpdateRequest;
import com.Gathering_be.dto.response.ProjectDetailResponse;
import com.Gathering_be.dto.response.ProjectSimpleResponse;
import com.Gathering_be.exception.InvalidSearchTypeException;
import com.Gathering_be.exception.ProfileNotFoundException;
import com.Gathering_be.exception.ProjectNotFoundException;
import com.Gathering_be.exception.UnauthorizedAccessException;
import com.Gathering_be.global.enums.SearchType;
import com.Gathering_be.repository.InterestProjectRepository;
import com.Gathering_be.repository.ProfileRepository;
import com.Gathering_be.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProfileRepository profileRepository;
    private final ProjectRepository projectRepository;
    private final InterestProjectRepository interestProjectRepository;
    private final RedisService redisService;

    @Transactional
    public ProjectDetailResponse createProject(ProjectCreateRequest request) {
        Long memberId = getCurrentUserId();
        Profile profile = findProfileByMemberId(memberId);

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
        return ProjectDetailResponse.from(savedProject, false);
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

        projectRepository.deleteById(projectId);
    }

    public ProjectDetailResponse getProjectById(Long projectId) {
        Long memberId = getCurrentUserId();
        incrementViewCount(projectId, memberId);

        Project project =  projectRepository.findById(projectId)
                .orElseThrow(ProjectNotFoundException::new);

        boolean isInterested = isUserInterestedInProject(projectId);
        return ProjectDetailResponse.from(project, isInterested);
    }

    public List<ProjectSimpleResponse> getAllProjects() {
        Long currentUserId = getCurrentUserId();
        Set<Long> interestedProjectIds = (currentUserId != null)
                ? interestProjectRepository.findAllByProfileId(getProfileIdByMemberId(currentUserId))
                .stream()
                .map(interest -> interest.getProject().getId())
                .collect(Collectors.toSet())
                : Set.of();

        return projectRepository.findAll().stream()
                .map(project -> ProjectSimpleResponse.from(project, interestedProjectIds.contains(project.getId())))
                .collect(Collectors.toList());
    }

    public List<ProjectSimpleResponse> searchProjects(SearchType searchType, String keyword) {
        Long currentUserId = getCurrentUserId();
        List<Project> projects;

        if (searchType == null) {
            throw new InvalidSearchTypeException();
        }

        switch (searchType) {
            case TITLE:
                projects = projectRepository.findByTitleContaining(keyword);
                break;
            case CONTENT:
                projects = projectRepository.findByDescriptionContaining(keyword);
                break;
            case TITLE_CONTENT:
                projects = projectRepository.findByTitleContainingOrDescriptionContaining(keyword, keyword);
                break;
            default:
                throw new InvalidSearchTypeException();
        }

        return projects.stream()
                .map(project -> {
                    boolean isInterested = (currentUserId != null) && isUserInterestedInProject(currentUserId, project.getId());
                    return ProjectSimpleResponse.from(project, isInterested);
                })
                .collect(Collectors.toList());
    }


    private void validateMemberAccess(Project project) {
        Long currentUserId = getCurrentUserId();
        if (!project.getProfile().getMember().getId().equals(currentUserId)) {
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
}
