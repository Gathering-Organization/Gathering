package com.Gathering_be.dto.response;

import com.Gathering_be.domain.Member;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.global.enums.Career;
import com.Gathering_be.global.enums.JobPosition;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProfileResponse {
    private String email;
    private String name;
    private String nickname;
    private JobPosition jobPosition;
    private String organization;
    private Career career;
    private String introduction;
    private Set<String> techStacks;
    private String githubUrl;
    private String notionUrl;
    private String profileImageUrl;
    private List<String> portfolioUrls;
    private boolean isPublic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder
    public ProfileResponse(String email, String name, String nickname,
                           JobPosition jobPosition, String organization,
                           Career career, String introduction, Set<String> techStacks,
                           String githubUrl, String notionUrl,
                           String profileImageUrl, List<String> portfolioUrls,
                           boolean isPublic, LocalDateTime createdAt,
                           LocalDateTime updatedAt) {
        this.email = email;
        this.name = name;
        this.nickname = nickname;
        this.jobPosition = jobPosition;
        this.organization = organization;
        this.career = career;
        this.introduction = introduction;
        this.techStacks = techStacks;
        this.githubUrl = githubUrl;
        this.notionUrl = notionUrl;
        this.profileImageUrl = profileImageUrl;
        this.portfolioUrls = portfolioUrls;
        this.isPublic = isPublic;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static ProfileResponse from(Member member, Profile profile) {
        return ProfileResponse.builder()
                .email(member.getEmail())
                .name(member.getName())
                .nickname(member.getNickname())
                .jobPosition(profile.getJobPosition())
                .organization(profile.getOrganization())
                .career(profile.getCareer())
                .introduction(profile.getIntroduction())
                .techStacks(profile.getTechStacks())
                .githubUrl(profile.getGithubUrl())
                .notionUrl(profile.getNotionUrl())
                .profileImageUrl(profile.getProfileImageUrl())
                .portfolioUrls(profile.getPortfolioUrls())
                .isPublic(profile.isPublic())
                .createdAt(member.getCreatedAt())
                .updatedAt(member.getUpdatedAt())
                .build();
    }
}