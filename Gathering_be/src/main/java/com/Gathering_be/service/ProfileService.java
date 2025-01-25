package com.Gathering_be.service;

import com.Gathering_be.domain.Member;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.domain.WorkExperience;
import com.Gathering_be.dto.request.ProfileCreateRequest;
import com.Gathering_be.dto.request.ProfileUpdateRequest;
import com.Gathering_be.dto.response.ProfileResponse;
import com.Gathering_be.exception.MemberNotFoundException;
import com.Gathering_be.exception.ProfileNotFoundException;
import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;
import com.Gathering_be.global.service.S3Service;
import com.Gathering_be.repository.MemberRepository;
import com.Gathering_be.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProfileService {
    private final MemberRepository memberRepository;
    private final ProfileRepository profileRepository;
    private final S3Service s3Service;

    @Transactional
    public void updateProfile(ProfileUpdateRequest request, MultipartFile profileImage) {
        Long memberId = getCurrentUserId();
        Profile profile = getProfileByMemberId(memberId);

        String profileImageUrl = null;
        if (profileImage != null && !profileImage.isEmpty()) {
            if (profile.getProfileImageUrl() != null) {
                s3Service.deleteFile(profile.getProfileImageUrl());
            }
            profileImageUrl = s3Service.uploadFile("profile", profileImage);
        }

        List<WorkExperience> workExperiences = request.getWorkExperiences().stream()
                .map(WorkExperience::from)
                .collect(Collectors.toList());

        profile.update(request, profileImageUrl, workExperiences);
    }

    @Transactional
    public void toggleProfileVisibility() {
        Long memberId = getCurrentUserId();
        Profile profile = getProfileByMemberId(memberId);
        profile.togglePublic();
    }

    public ProfileResponse getProfileById(Long profileId) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(ProfileNotFoundException::new);

        if (!profile.isPublic()) {
            Long currentUserId = getCurrentUserId();
            if (!profile.getMember().getId().equals(currentUserId)) {
                throw new BusinessException(ErrorCode.PROFILE_ACCESS_DENIED);
            }
        }

        return ProfileResponse.from(profile.getMember(), profile);
    }

    public ProfileResponse getMyProfile() {
        Long memberId = getCurrentUserId();
        Profile profile = getProfileByMemberId(memberId);
        return ProfileResponse.from(profile.getMember(), profile);
    }

    private Profile getProfileByMemberId(Long memberId) {
        return profileRepository.findByMemberId(memberId)
                .orElseThrow(ProfileNotFoundException::new);
    }

    private Long getCurrentUserId() {
        return Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
    }
}