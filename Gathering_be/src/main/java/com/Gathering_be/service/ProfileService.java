package com.Gathering_be.service;

import com.Gathering_be.domain.Member;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.dto.request.ProfileCreateRequest;
import com.Gathering_be.dto.request.ProfileUpdateRequest;
import com.Gathering_be.dto.response.ProfileResponse;
import com.Gathering_be.exception.MemberNotFoundException;
import com.Gathering_be.exception.ProfileNotFoundException;
import com.Gathering_be.global.service.S3Service;
import com.Gathering_be.repository.MemberRepository;
import com.Gathering_be.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProfileService {
    private final MemberRepository memberRepository;
    private final ProfileRepository profileRepository;
    private final S3Service s3Service;

    public ProfileResponse getProfile(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);
        Profile profile = profileRepository.findByMemberId(memberId)
                .orElseThrow(ProfileNotFoundException::new);
        return ProfileResponse.from(member, profile);
    }

    @Transactional
    public ProfileResponse createProfile(Long memberId, ProfileCreateRequest request,
                                         MultipartFile profileImage, MultipartFile portfolioFile) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);

        String profileImageUrl = null;
        String portfolioUrl = null;

        if (profileImage != null && !profileImage.isEmpty()) {
            profileImageUrl = s3Service.uploadFile("profile", profileImage);
        }

        if (portfolioFile != null && !portfolioFile.isEmpty()) {
            portfolioUrl = s3Service.uploadFile("portfolio", portfolioFile);
        }

        Profile profile = Profile.builder()
                .member(member)
                .jobPosition(request.getJobPosition())
                .organization(request.getOrganization())
                .career(request.getCareer())
                .introduction(request.getIntroduction())
                .techStacks(new HashSet<>(request.getTechStacks()))
                .githubUrl(request.getGithubUrl())
                .notionUrl(request.getNotionUrl())
                .profileImageUrl(profileImageUrl)
                .portfolioUrl(portfolioUrl)
                .build();

        Profile savedProfile = profileRepository.save(profile);
        return ProfileResponse.from(member, savedProfile);
    }

    @Transactional
    public void updateProfile(Long memberId, ProfileUpdateRequest request,
                              MultipartFile profileImage, MultipartFile portfolioFile) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);
        Profile profile = profileRepository.findByMemberId(memberId)
                .orElseThrow(ProfileNotFoundException::new);

        String profileImageUrl = null;
        String portfolioUrl = null;

        if (profileImage != null && !profileImage.isEmpty()) {
            if (profile.getProfileImageUrl() != null) {
                s3Service.deleteFile(profile.getProfileImageUrl());
            }
            profileImageUrl = s3Service.uploadFile("profile", profileImage);
        }

        if (portfolioFile != null && !portfolioFile.isEmpty()) {
            if (profile.getPortfolioUrl() != null) {
                s3Service.deleteFile(profile.getPortfolioUrl());
            }
            portfolioUrl = s3Service.uploadFile("portfolio", portfolioFile);
        }

        profile.update(request, profileImageUrl, portfolioUrl);
    }
}