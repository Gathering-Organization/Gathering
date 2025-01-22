package com.Gathering_be.controller;

import com.Gathering_be.dto.request.ProfileCreateRequest;
import com.Gathering_be.dto.request.ProfileUpdateRequest;
import com.Gathering_be.dto.response.ProfileResponse;
import com.Gathering_be.global.response.ResultCode;
import com.Gathering_be.global.response.ResultResponse;
import com.Gathering_be.global.service.S3Service;
import com.Gathering_be.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;
    private final S3Service s3Service;

    @GetMapping
    public ResponseEntity<ResultResponse> getProfile() {
        Long memberId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        ProfileResponse profile = profileService.getProfile(memberId);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROFILE_READ_SUCCESS, profile));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResultResponse> createProfile(
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestPart(value = "portfolioFile", required = false) MultipartFile portfolioFile,
            @RequestPart("request") ProfileCreateRequest request) {
        Long memberId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        ProfileResponse response = profileService.createProfile(memberId, request, profileImage, portfolioFile);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROFILE_CREATE_SUCCESS, response));
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResultResponse> updateProfile(
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestPart(value = "portfolioFile", required = false) MultipartFile portfolioFile,
            @RequestPart("request") ProfileUpdateRequest request) {
        Long memberId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        profileService.updateProfile(memberId, request, profileImage, portfolioFile);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROFILE_UPDATE_SUCCESS));
    }
}