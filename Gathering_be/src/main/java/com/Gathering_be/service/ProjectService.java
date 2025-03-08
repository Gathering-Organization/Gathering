package com.Gathering_be.service;

import com.Gathering_be.domain.Profile;
import com.Gathering_be.domain.Project;
import com.Gathering_be.domain.ProjectTeams;
import com.Gathering_be.dto.request.ProjectCreateRequest;
import com.Gathering_be.dto.request.ProjectUpdateRequest;
import com.Gathering_be.dto.response.ProjectDetailResponse;
import com.Gathering_be.dto.response.ProjectSimpleResponse;
import com.Gathering_be.exception.ProfileNotFoundException;
import com.Gathering_be.exception.ProjectNotFoundException;
import com.Gathering_be.exception.UnauthorizedAccessException;
import com.Gathering_be.repository.ApplicationRepository;
import com.Gathering_be.repository.InterestProjectRepository;
import com.Gathering_be.repository.ProfileRepository;
import com.Gathering_be.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProfileRepository profileRepository;
    private final ProjectRepository projectRepository;
    private final InterestProjectRepository interestProjectRepository;
    private final ApplicationRepository applicationRepository;

    @Transactional
    public ProjectDetailResponse createProject(ProjectCreateRequest request) {
        Long memberId = getCurrentUserId();
        Profile profile = findProfileByMemberId(memberId);

        Set<Profile> teams = findProfilesByNicknames(request.getTeams());

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
        Project project =  projectRepository.findById(projectId)
                .orElseThrow(ProjectNotFoundException::new);

        boolean isInterested = isUserInterestedInProject(projectId);
        return ProjectDetailResponse.from(project, isInterested);
    }

    public List<ProjectSimpleResponse> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        return projects.stream()
                .map(project -> {
                    boolean isInterested = isUserInterestedInProject(project.getId());
                    return ProjectSimpleResponse.from(project, isInterested);
                })
                .collect(Collectors.toList());
    }

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void closeExpiredProjects() {
        LocalDateTime now = LocalDateTime.now();

        List<Project> expiredProjects = projectRepository.findAllByDeadlineBeforeAndIsClosedFalse(now);

        for (Project project : expiredProjects) {
            project.closeProject();
            applicationRepository.updatePendingApplicationsToRejected(project.getId());
        }
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

    private Set<Profile> findProfilesByNicknames(Set<String> teams) {
        return teams.stream()
                .map(nickname -> profileRepository.findByNickname(nickname)
                        .orElseThrow(ProfileNotFoundException::new))
                .collect(Collectors.toSet());
    }

    private Set<ProjectTeams> createProjectTeams(Project project, Set<String> teamNicknames) {
        return teamNicknames.stream()
                .map(nickname -> {
                    Profile teamMember = profileRepository.findByNickname(nickname)
                            .orElseThrow(ProfileNotFoundException::new);
                    return ProjectTeams.builder().profile(teamMember).project(project).build();
                })
                .collect(Collectors.toSet());
    }

    private boolean isUserInterestedInProject(Long projectId) {
        Long profileId = getProfileIdByMemberId(getCurrentUserId());
        return interestProjectRepository.existsByProfileIdAndProjectId(profileId, projectId);
    }

    private Long getCurrentUserId() {
        return Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
    }

    private Long getProfileIdByMemberId(Long memberId) {
        Profile profile = profileRepository.findByMemberId(memberId)
                .orElseThrow(ProfileNotFoundException::new);
        return profile.getId();
    }
}
