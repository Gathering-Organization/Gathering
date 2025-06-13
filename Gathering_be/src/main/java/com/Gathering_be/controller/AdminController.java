package com.Gathering_be.controller;

import com.Gathering_be.dto.request.RoleUpdateRequest;
import com.Gathering_be.dto.response.MemberInfoForAdminResponse;
import com.Gathering_be.dto.response.ProjectResponseForAdmin;
import com.Gathering_be.global.enums.SearchType;
import com.Gathering_be.global.response.ResultCode;
import com.Gathering_be.global.response.ResultResponse;
import com.Gathering_be.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/members")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResultResponse> findMembers(@RequestParam(required = false) String keyword,
                                                      @PageableDefault(size = 10) Pageable pageable
    ) {
        Page<MemberInfoForAdminResponse> members = adminService.findMembers(keyword, pageable);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.MEMBER_READ_SUCCESS, members));
    }

    @PatchMapping("/members/{memberId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResultResponse> changeMemberRole(@PathVariable Long memberId, @RequestBody RoleUpdateRequest request) {
        adminService.changeMemberRole(memberId, request.getNewRole());
        return ResponseEntity.ok(ResultResponse.of(ResultCode.MEMBER_ROLE_CHANGE_SUCCESS));
    }

    @GetMapping("/project/pagination")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResultResponse> getAllProjects(@RequestParam(defaultValue = "1") int page,
                                                         @RequestParam(defaultValue = "-createdAt") String sort,
                                                         @RequestParam(defaultValue = "ALL") String position,
                                                         @RequestParam(required = false) String techStack,
                                                         @RequestParam(defaultValue = "ALL") String type,
                                                         @RequestParam(defaultValue = "ALL") String mode,
                                                         @RequestParam(required = false) Boolean isClosed,
                                                         @RequestParam(required = false) Boolean isDeleted,
                                                         @RequestParam(required = false) SearchType searchType,
                                                         @RequestParam(required = false) String keyword
    ) {
        Page<ProjectResponseForAdmin> projects = adminService.searchProjectsWithFilters(
                page, 18, sort, position, techStack, type, mode, isClosed, isDeleted, searchType, keyword
        );
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_READ_SUCCESS, projects));
    }

    @DeleteMapping("/project/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResultResponse> deleteProject(@PathVariable Long id) {
        adminService.deleteProject(id);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROJECT_DELETE_SUCCESS));
    }

}