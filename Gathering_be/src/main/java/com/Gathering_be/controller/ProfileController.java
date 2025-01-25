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

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ResultResponse> getMyProfile() {
        ProfileResponse profile = profileService.getMyProfile();
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROFILE_READ_SUCCESS, profile));
    }

    @GetMapping("/{profileId}")
    public ResponseEntity<ResultResponse> getProfile(@PathVariable Long profileId) {
        ProfileResponse profile = profileService.getProfileById(profileId);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROFILE_READ_SUCCESS, profile));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResultResponse> createProfile(
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestPart(value = "portfolioFiles", required = false) List<MultipartFile> portfolioFiles,
            @RequestPart("request") ProfileCreateRequest request) {
        ProfileResponse response = profileService.createProfile(request, profileImage, portfolioFiles);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROFILE_CREATE_SUCCESS, response));
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResultResponse> updateProfile(
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestPart(value = "portfolioFiles", required = false) List<MultipartFile> portfolioFiles,
            @RequestPart("request") ProfileUpdateRequest request) {
        profileService.updateProfile(request, profileImage, portfolioFiles);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROFILE_UPDATE_SUCCESS));
    }

    @PutMapping("/visibility")
    public ResponseEntity<ResultResponse> toggleProfileVisibility() {
        profileService.toggleProfileVisibility();
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROFILE_VISIBILITY_UPDATE_SUCCESS));
    }
}