package com.Gathering_be.controller;

import com.Gathering_be.dto.request.ProjectCreateRequest;
import com.Gathering_be.dto.request.ProjectUpdateRequest;
import com.Gathering_be.dto.response.ProjectDetailResponse;
import com.Gathering_be.dto.response.ProjectSimpleResponse;
import com.Gathering_be.global.enums.SearchType;
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

    @PostMapping
    public ResponseEntity<ResultResponse> createProject(@RequestBody ProjectCreateRequest request) {
        ProjectDetailResponse project = projectService.createProject(request);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_CREATE_SUCCESS, project));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultResponse> getProjectById(@PathVariable Long id) {
        ProjectDetailResponse project = projectService.getProjectById(id);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_READ_SUCCESS, project));
    }

    @GetMapping
    public ResponseEntity<ResultResponse> getAllProjects(@RequestParam(defaultValue = "1") int page) {
        List<ProjectSimpleResponse> projects = projectService.getAllProjects(page, 20);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_READ_SUCCESS, projects));
    }

    @GetMapping("/nickname/{nickname}")
    public ResponseEntity<ResultResponse> getProjectsByNickname(@PathVariable String nickname) {
        List<ProjectSimpleResponse> projects = projectService.getProjectsByNickname(nickname);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_READ_SUCCESS, projects));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResultResponse> updateProject(@PathVariable Long id,
                                                        @RequestBody ProjectUpdateRequest request) {
        projectService.updateProject(id, request);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_UPDATE_SUCCESS));
    }

    @PutMapping("/recruitment/{id}")
    public ResponseEntity<ResultResponse> toggleProfileVisibility(@PathVariable Long id) {
        projectService.toggleProjectRecruitment(id);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_VISIBILITY_UPDATE_SUCCESS));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResultResponse> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_DELETE_SUCCESS));
    }

    @GetMapping("/search")
    public ResponseEntity<ResultResponse> searchProjects(@RequestParam SearchType searchType, @RequestParam String keyword) {
        List<ProjectSimpleResponse> projects = projectService.searchProjects(searchType, keyword);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_SEARCH_SUCCESS, projects));
    }
}
