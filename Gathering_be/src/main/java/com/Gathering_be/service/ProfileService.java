package com.Gathering_be.service;

import com.Gathering_be.domain.Profile;
import com.Gathering_be.dto.request.ProfileUpdateRequest;
import com.Gathering_be.dto.response.ProfileResponse;
import com.Gathering_be.exception.ProfileNotFoundException;
import com.Gathering_be.global.service.S3Service;
import com.Gathering_be.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final S3Service s3Service;

    @Transactional
    public void updateProfile(ProfileUpdateRequest request) {
        Profile profile = getProfileByMemberId(getCurrentUserId());

        if (request.getNickname() != null && !request.getNickname().equals(profile.getNickname())) {
            if (profileRepository.existsByNickname(request.getNickname())) {
                String baseNickname = request.getNickname();
                String uniqueNickname = generateUniqueNickname(baseNickname);
                request = ProfileUpdateRequest.builder()
                        .nickname(uniqueNickname)
                        .introduction(request.getIntroduction())
                        .workExperiences(request.getWorkExperiences())
                        .build();
            }
        }
        profile.update(request);
    }

    private String generateUniqueNickname(String baseNickname) {
        while (true) {
            int randomNumber = (int) (Math.random() * 900000) + 100000;
            String nickname = baseNickname + "#" + randomNumber;
            if (!profileRepository.existsByNickname(nickname)) {
                return nickname;
            }
        }
    }

    @Transactional
    public void updatePortfolio(MultipartFile file) {
        Profile profile = getProfileByMemberId(getCurrentUserId());

        if (profile.getPortfolioUrl() != null) {
            s3Service.deleteFile(profile.getPortfolioUrl());
        }

        String fileUrl = s3Service.uploadFile("portfolio", file);
        profile.updatePortfolio(fileUrl);
    }

    @Transactional
    public void deletePortfolio() {
        Profile profile = getProfileByMemberId(getCurrentUserId());

        if (profile.getPortfolioUrl() != null) {
            s3Service.deleteFile(profile.getPortfolioUrl());
            profile.removePortfolio();
        }
    }

    @Transactional
    public void toggleProfileVisibility() {
        Profile profile = getProfileByMemberId(getCurrentUserId());
        profile.togglePublic();
    }

    public ProfileResponse getProfileById(Long profileId) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(ProfileNotFoundException::new);
        return ProfileResponse.from(profile, false);
    }

    public ProfileResponse getMyProfile() {
        Profile profile = getProfileByMemberId(getCurrentUserId());
        return ProfileResponse.from(profile, true);
    }

    private Profile getProfileByMemberId(Long memberId) {
        return profileRepository.findByMemberId(memberId)
                .orElseThrow(ProfileNotFoundException::new);
    }

    private Long getCurrentUserId() {
        return Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
    }
}