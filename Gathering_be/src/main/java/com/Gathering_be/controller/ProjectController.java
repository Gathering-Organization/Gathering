package com.Gathering_be.controller;

import com.Gathering_be.dto.request.ProjectCreateRequest;
import com.Gathering_be.dto.request.ProjectUpdateRequest;
import com.Gathering_be.dto.response.ProjectDetailResponse;
import com.Gathering_be.dto.response.ProjectSimpleResponse;
import com.Gathering_be.global.response.ResultCode;
import com.Gathering_be.global.response.ResultResponse;
import com.Gathering_be.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    // 프로젝트 생성
    @PostMapping
    public ResponseEntity<ResultResponse> createProject(@RequestBody ProjectCreateRequest request) {
        ProjectDetailResponse project = projectService.createProject(request);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_CREATE_SUCCESS, project));
    }

    // 프로젝트 조회 (ID로 단일 조회)
    @GetMapping("/{id}")
    public ResponseEntity<ResultResponse> getProjectById(@PathVariable Long id) {
        ProjectDetailResponse project = projectService.getProjectById(id);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_READ_SUCCESS, project));
    }

    // 전체 프로젝트 조회
    @GetMapping()
    public ResponseEntity<ResultResponse> getAllProjects() {
        List<ProjectSimpleResponse> projects = projectService.getAllProjects();
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_READ_SUCCESS, projects));
    }

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
