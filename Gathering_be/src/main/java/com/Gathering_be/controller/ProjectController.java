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
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/pagination")
    public ResponseEntity<ResultResponse> getAllProjects(@RequestParam(defaultValue = "1") int page,
                                                         @RequestParam(defaultValue = "-createdAt") String sort,
                                                         @RequestParam(defaultValue = "ALL") String position,
                                                         @RequestParam(required = false) String techStack,
                                                         @RequestParam(defaultValue = "ALL") String type,
                                                         @RequestParam(defaultValue = "ALL") String mode,
                                                         @RequestParam(required = false) Boolean isClosed,
                                                         @RequestParam(required = false) SearchType searchType,
                                                         @RequestParam(required = false) String keyword
    ) {
        Page<ProjectSimpleResponse> projects = projectService.searchProjectsWithFilters(
                page, 20, sort, position, techStack, type, mode, isClosed, searchType, keyword
        );
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_READ_SUCCESS, projects));
    }

    @GetMapping("/pagination/my-project")
    public ResponseEntity<ResultResponse> getProjectsByNickname(@RequestParam String nickname,
                                                                @RequestParam(defaultValue = "1") int page,
                                                                @RequestParam(required = false) Boolean isClosed
    ) {
        Page<ProjectSimpleResponse> projects = projectService.getProjectsByNickname(nickname, page, 20, isClosed);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_READ_SUCCESS, projects));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResultResponse> updateProject(@PathVariable Long id,
                                                        @RequestBody ProjectUpdateRequest request
    ) {
        projectService.updateProject(id, request);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_UPDATE_SUCCESS));
    }

    @PutMapping("/toggle/isClosed/{id}")
    public ResponseEntity<ResultResponse> toggleIsClosed(@PathVariable Long id) {
        projectService.toggleProjectRecruitment(id);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_VISIBILITY_UPDATE_SUCCESS));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResultResponse> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_DELETE_SUCCESS));
    }
}
