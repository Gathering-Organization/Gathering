package com.Gathering_be.service;

import com.Gathering_be.domain.Profile;
import com.Gathering_be.domain.Project;
import com.Gathering_be.dto.request.ProjectCreateRequest;
import com.Gathering_be.dto.request.ProjectUpdateRequest;
import com.Gathering_be.dto.response.ProjectDetailResponse;
import com.Gathering_be.dto.response.ProjectSimpleResponse;
import com.Gathering_be.exception.ProfileNotFoundException;
import com.Gathering_be.exception.ProjectNotFoundException;
import com.Gathering_be.exception.UnauthorizedAccessException;
import com.Gathering_be.repository.ProfileRepository;
import com.Gathering_be.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProfileRepository profileRepository;
    private final ProjectRepository projectRepository;

    @Transactional
    public ProjectDetailResponse createProject(ProjectCreateRequest request) {
        Long memberId = getCurrentUserId();
        Profile profile = findProfileByMemberId(memberId);

        Set<Profile> teams = findProfilesByIds(request.getTeams());

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
                .teams(teams)
                .requiredPositions(request.getRequiredPositions())
                .build();

        Project savedProject = projectRepository.save(project);

        return ProjectDetailResponse.from(savedProject);
    }

    @Transactional
    public void updateProject(Long projectId, ProjectUpdateRequest request) {
        Project project = findProjectById(projectId);
        validateMemberAccess(project);

        Set<Profile> teams = findProfilesByIds(request.getTeams());

        project.update(request);
        project.setTeams(teams);
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

        return ProjectDetailResponse.from(project);
    }

    public List<ProjectSimpleResponse> getAllProjects() {
        return projectRepository.findAll()
                .stream()
                .map(ProjectSimpleResponse::from)
                .toList();
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

    private Set<Profile> findProfilesByIds(Set<Profile> teams) {
        return teams.stream()
                .map(profile -> profileRepository.findById(profile.getId())
                        .orElseThrow(ProfileNotFoundException::new))
                .collect(Collectors.toSet());
    }

    private Long getCurrentUserId() {
        return Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
    }
}
