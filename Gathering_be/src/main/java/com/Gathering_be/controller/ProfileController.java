package com.Gathering_be.controller;

import com.Gathering_be.dto.request.ProfileUpdateRequest;
import com.Gathering_be.dto.response.ProfileResponse;
import com.Gathering_be.global.response.ResultCode;
import com.Gathering_be.global.response.ResultResponse;
import com.Gathering_be.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @GetMapping("/nickname/{nickname}")
    public ResponseEntity<ResultResponse> getProfileByNickname(@PathVariable String nickname) {
        ProfileResponse profile = profileService.getProfileByNickname(nickname);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROFILE_READ_SUCCESS, profile));
    }

    @PutMapping
    public ResponseEntity<ResultResponse> updateProfile(@RequestBody @Valid ProfileUpdateRequest request) {
        profileService.updateProfile(request);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROFILE_UPDATE_SUCCESS));
    }

    @PostMapping(value = "/portfolio", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResultResponse> updatePortfolio(@RequestParam("file") MultipartFile file) {
        profileService.updatePortfolio(file);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PORTFOLIO_UPDATE_SUCCESS));
    }

    @DeleteMapping("/portfolio")
    public ResponseEntity<ResultResponse> deletePortfolio() {
        profileService.deletePortfolio();
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PORTFOLIO_DELETE_SUCCESS));
    }

    @PutMapping("/visibility")
    public ResponseEntity<ResultResponse> toggleProfileVisibility() {
        profileService.toggleProfileVisibility();
        return ResponseEntity.ok(ResultResponse.of(ResultCode.PROFILE_VISIBILITY_UPDATE_SUCCESS));
    }
}
