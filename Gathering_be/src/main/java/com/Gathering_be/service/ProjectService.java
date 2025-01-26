package com.Gathering_be.service;

import com.Gathering_be.domain.Member;
import com.Gathering_be.domain.Project;
import com.Gathering_be.dto.request.ProjectCreateRequest;
import com.Gathering_be.dto.request.ProjectUpdateRequest;
import com.Gathering_be.dto.response.ProjectResponse;
import com.Gathering_be.exception.MemberNotFoundException;
import com.Gathering_be.exception.ProjectNotFoundException;
import com.Gathering_be.repository.MemberRepository;
import com.Gathering_be.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final MemberRepository memberRepository;
    private final ProjectRepository projectRepository;

    // 프로젝트 생성
    @Transactional
    public Project createProject(ProjectCreateRequest request) {
        Long memberId = getCurrentUserId();
        Member member = memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);

        Project project = Project.builder()
                .member(member)
                .title(request.getTitle())
                .description(request.getDescription())
                .kakaoUrl(request.getKakaoUrl())
                .projectType(request.getProjectType())
                .totalMembers(request.getTotalMembers())
                .duration(request.getDuration())
                .deadline(request.getDeadline())
                .startDate(request.getStartDate())
                .techStacks(request.getTechStacks())
                .projectMode(request.getProjectMode())
                .build();

        return projectRepository.save(project);
    }

    // 프로젝트 수정
    // TODO: 프로젝트 모집글 수정은 글을 쓴 사람만이 할수 있게 해야 함
    @Transactional
    public Project updateProject(Long projectId, ProjectUpdateRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(ProjectNotFoundException::new);

        project.update(request);

        return project;
    }

    // 프로젝트 삭제
    // TODO: 프로젝트 모집글 삭제는 글을 쓴 사람만이 할수 있게 해야 함
    @Transactional
    public void deleteProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(ProjectNotFoundException::new);
        projectRepository.delete(project);
    }

    // 프로젝트 조회
    public Project getProject(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(ProjectNotFoundException::new);
    }

    // 회원의 모든 프로젝트 조회 (회원이 등록한 모집글)
    public List<Project> getProjectsByMember(Long memberId) {
        return projectRepository.findProjectsByMemberId(memberId);
    }

    // TODO: 회원이 지원한 모든 지원글들을 조회
    // ???

    // 모든 프로젝트 목록 조회
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    private Project getProjectByMemberId(Long memberId) {
        return projectRepository.findByMemberId(memberId)
                .orElseThrow(ProjectNotFoundException::new);
    }

    private Long getCurrentUserId() {
        return Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
    }
}
