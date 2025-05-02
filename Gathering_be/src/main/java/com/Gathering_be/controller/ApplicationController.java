package com.Gathering_be.controller;

import com.Gathering_be.dto.request.ApplicationRequest;
import com.Gathering_be.dto.response.ApplicationResponse;
import com.Gathering_be.dto.response.ProjectSimpleResponse;
import com.Gathering_be.global.enums.ApplyStatus;
import com.Gathering_be.global.response.ResultCode;
import com.Gathering_be.global.response.ResultResponse;
import com.Gathering_be.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/application")
@RequiredArgsConstructor
public class ApplicationController {
    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ResultResponse> applyForProject(@RequestBody ApplicationRequest request) {
        applicationService.applyForProject(request);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.APPLICATION_CREATE_SUCCESS));
    }

    @GetMapping("/received/project/{projectId}")
    public ResponseEntity<ResultResponse> getApplicationsForProject(@PathVariable Long projectId) {
        List<ApplicationResponse> applications = applicationService.getApplicationsForProject(projectId);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.APPLICATION_READ_SUCCESS, applications));
    }

    @GetMapping("/my")
    public ResponseEntity<ResultResponse> getMyApplications(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(required = false) ApplyStatus status
    ) {
        Page<ProjectSimpleResponse> projects = applicationService.getMyAppliedProjects(page, 18, status);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_READ_SUCCESS, projects));
    }

    @GetMapping("/my/project/{projectId}")
    public ResponseEntity<ResultResponse> getMyApplicationByProjectId(@PathVariable Long projectId) {
        ApplicationResponse application = applicationService.getMyApplicationByProjectId(projectId);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.APPLICATION_READ_SUCCESS, application));
    }

    @DeleteMapping("/{applicationId}")
    public ResponseEntity<ResultResponse> cancelApplication(@PathVariable Long applicationId) {
        applicationService.deleteApplication(applicationId);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.APPLICATION_DELETE_SUCCESS));
    }

    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<ResultResponse> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplyStatus status) {
        applicationService.updateApplicationStatus(applicationId, status);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.APPLICATION_STATUS_UPDATED));
    }
}