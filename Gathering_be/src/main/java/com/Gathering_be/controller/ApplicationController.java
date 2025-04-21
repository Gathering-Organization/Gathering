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

    @GetMapping("/project/{projectId}")
    public ResponseEntity<ResultResponse> getApplicationsByProject(@PathVariable Long projectId) {
        List<ApplicationResponse> applications = applicationService.getApplicationsByProject(projectId);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.APPLICATION_READ_SUCCESS, applications));
    }

    @GetMapping("/my-apply")
    public ResponseEntity<ResultResponse> getApplicationsByProfile(
            @RequestParam String nickname,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(required = false) ApplyStatus status
    ) {
        Page<ProjectSimpleResponse> projects = applicationService.getAppliedProjectsByNickname(nickname, page, 18, status);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_READ_SUCCESS, projects));
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