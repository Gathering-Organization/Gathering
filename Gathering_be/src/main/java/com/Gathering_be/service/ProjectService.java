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

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProfileRepository profileRepository;
    private final ProjectRepository projectRepository;

    // 프로젝트 생성
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
                .teams(request.getTeams())
                .requiredPositions(request.getRequiredPositions())
                .build();

        Project savedProject = projectRepository.save(project);

        return ProjectDetailResponse.from(savedProject);
    }

    // 프로젝트 수정
    @Transactional
    public void updateProject(Long projectId, ProjectUpdateRequest request) {
        Project project = findProjectById(projectId);
        validateMemberAccess(project);

        project.update(request);
    }

    // 프로젝트 삭제
    @Transactional
    public void deleteProject(Long projectId) {
        Project project = findProjectById(projectId);
        validateMemberAccess(project);

        projectRepository.delete(project);
    }

    // 프로젝트 단일 조회
    public ProjectDetailResponse getProjectById(Long projectId) {
        Project project =  projectRepository.findById(projectId)
                .orElseThrow(ProjectNotFoundException::new);

        return ProjectDetailResponse.from(project);
    }

    // 모든 프로젝트 목록 조회
    public List<ProjectSimpleResponse> getAllProjects() {
        List<ProjectSimpleResponse> projects = projectRepository.findAll()
                .stream()
                .map(ProjectSimpleResponse::new)
                .toList();

        return projects;
    }

    ///////////// 편의성 메서드 ////////////
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

    private Long getCurrentUserId() {
        return Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
    }
}
