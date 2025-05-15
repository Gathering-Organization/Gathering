package com.Gathering_be.dto.response;

import com.Gathering_be.domain.Portfolio;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.global.enums.TechStack;
import com.Gathering_be.global.service.S3Service;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProfileResponse {
    private String profileColor;
    private String nickname;
    private String introduction;
    private boolean isPublic;
    private String organization;
    private Set<TechStack> techStacks;
    private Portfolio portfolio;
    private List<WorkExperienceResponse> workExperiences;

    private int totalProjects;
    private int openedProjects;
    private int closedProjects;

    private int totalApplications;
    private int pendingApplications;
    private int approvedApplications;
    private int rejectedApplications;

    @Builder
    public ProfileResponse(String profileColor, String nickname, String introduction,
                           boolean isPublic, String organization, Set<TechStack> techStacks,
                           Portfolio portfolio, List<WorkExperienceResponse> workExperiences,
                           int totalProjects, int openedProjects, int closedProjects,
                           int totalApplications, int pendingApplications, int approvedApplications, int rejectedApplications) {
        this.profileColor = profileColor;
        this.nickname = nickname;
        this.introduction = introduction;
        this.isPublic = isPublic;
        this.organization = organization;
        this.techStacks = techStacks;
        this.portfolio = portfolio;
        this.workExperiences = workExperiences;
        this.totalProjects = totalProjects;
        this.openedProjects = openedProjects;
        this.closedProjects = closedProjects;
        this.totalApplications = totalApplications;
        this.pendingApplications = pendingApplications;
        this.approvedApplications = approvedApplications;
        this.rejectedApplications = rejectedApplications;
    }

    public static ProfileResponse from(Profile profile, boolean isMyProfile, S3Service s3Service) {
        ProfileResponse.ProfileResponseBuilder builder = ProfileResponse.builder()
                .profileColor(profile.getProfileColor())
                .nickname(profile.getNickname())
                .introduction(profile.getIntroduction())
                .isPublic(profile.isPublic())
                .techStacks(profile.getTechStacks())
                .workExperiences(profile.getWorkExperiences().stream()
                        .map(WorkExperienceResponse::from)
                        .collect(Collectors.toList()));

        if (isMyProfile || profile.isPublic()) {
            builder.organization(profile.getOrganization());
            builder.totalProjects(profile.getTotalProjects());
            builder.openedProjects(profile.getOpenedProjects());
            builder.closedProjects(profile.getClosedProjects());
            builder.totalApplications(profile.getTotalApplications());
            builder.pendingApplications(profile.getPendingApplications());
            builder.approvedApplications(profile.getApprovedApplications());
            builder.rejectedApplications(profile.getRejectedApplications());
        }

        if (isMyProfile) {
            Portfolio portfolio = profile.getPortfolio();
            if (portfolio != null) {
                String presignedUrl = s3Service.getPresignedUrl(portfolio.getUrl());
                builder.portfolio(new Portfolio(presignedUrl, portfolio.getFileName()));
            }
        }

        return builder.build();
    }
}
