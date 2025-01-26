package com.Gathering_be.controller;

import com.Gathering_be.domain.Project;
import com.Gathering_be.dto.request.ProjectCreateRequest;
import com.Gathering_be.dto.request.ProjectUpdateRequest;
import com.Gathering_be.dto.response.ProjectResponse;
import com.Gathering_be.global.response.ResultCode;
import com.Gathering_be.global.response.ResultResponse;
import com.Gathering_be.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/project")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    // 프로젝트 생성
    @PostMapping
    public ResponseEntity<ResultResponse> createProject(@RequestBody ProjectCreateRequest request) {
        Project project = projectService.createProject(request);
        ProjectResponse projectResponse = ProjectResponse.builder()
                .project(project)
                .build();

        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_CREATE_SUCCESS, projectResponse));
    }

    // 프로젝트 조회 (ID로 단일 조회)
    @GetMapping("/{id}")
    public ResponseEntity<ResultResponse> getProjectById(@PathVariable Long id) {
        Project project = projectService.getProject(id);
        ProjectResponse projectResponse = ProjectResponse.builder()
                .project(project)
                .build();

        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_READ_SUCCESS, projectResponse));

    }

    // 회원별 모든 프로젝트 조회
    // 이거 memberId가 url에 노출되면 안되는거 아닌가?
//    @GetMapping("/member/{memberId}")
//    public ResponseEntity<List<ProjectResponse>> getAllProjectsByMember(@PathVariable Long memberId) {
//        List<Project> projects = projectService.getProjectsByMember(memberId);
//
//        List<ProjectResponse> projectResponses = projects.stream()
//                .map(ProjectResponse)
//                .collect(Collectors.toList());
//
//        return ResponseEntity.ok(projectResponses);
//    }

    // 프로젝트 수정
    @PutMapping("/{id}")
    public ResponseEntity<ResultResponse> updateProject(@PathVariable Long id,
                                                        @RequestBody ProjectUpdateRequest request) {
        projectService.updateProject(id, request);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_UPDATE_SUCCESS));
    }

    // 프로젝트 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<ResultResponse> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_DELETE_SUCCESS));
    }
}
