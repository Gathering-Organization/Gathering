package com.Gathering_be.dto.response;

import com.Gathering_be.domain.Profile;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProfileResponse {
    private String profileColor;
    private String nickname;
    private String introduction;
    private boolean isPublic;
    private String organization;
    private Set<String> techStacks;
    private String portfolioUrl;
    private List<WorkExperienceResponse> workExperiences;

    @Builder
    public ProfileResponse(String profileColor, String nickname, String introduction,
                           boolean isPublic, String organization, Set<String> techStacks,
                           String portfolioUrl, List<WorkExperienceResponse> workExperiences) {
        this.profileColor = profileColor;
        this.nickname = nickname;
        this.introduction = introduction;
        this.isPublic = isPublic;
        this.organization = organization;
        this.techStacks = techStacks;
        this.portfolioUrl = portfolioUrl;
        this.workExperiences = workExperiences;
    }

    public static ProfileResponse from(Profile profile, boolean isMyProfile) {
        ProfileResponse.ProfileResponseBuilder builder = ProfileResponse.builder()
                .profileColor(profile.getProfileColor())
                .nickname(profile.getNickname())
                .introduction(profile.getIntroduction())
                .isPublic(profile.isPublic())
                .organization(profile.getOrganization())
                .techStacks(profile.getTechStacks());

        // 내 프로필이거나 public 프로필인 경우에만 포트폴리오 URL 포함
        if (isMyProfile || profile.isPublic()) {
            builder.portfolioUrl(profile.getPortfolioUrl());
        }

        return builder
                .workExperiences(profile.getWorkExperiences().stream()
                        .map(WorkExperienceResponse::from)
                        .collect(Collectors.toList()))
                .build();
    }
}