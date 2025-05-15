package com.Gathering_be.dto.response;

import com.Gathering_be.domain.Application;
import com.Gathering_be.domain.Portfolio;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.domain.WorkExperience;
import com.Gathering_be.global.enums.ApplyStatus;
import com.Gathering_be.global.enums.JobPosition;
import com.Gathering_be.global.enums.TechStack;
import com.Gathering_be.global.service.S3Service;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Set;

@Getter
public class ApplicationResponse {
    private Long id;
    private Long projectId;
    private JobPosition position;
    private String message;
    private ApplyStatus status;

    private String profileColor;
    private String nickname;
    private String organization;
    private Set<TechStack> techStacks;
    private List<WorkExperience> workExperiences;
    private Portfolio portfolio;

    @Builder
    public ApplicationResponse(Long id, Long projectId, JobPosition position,String message, ApplyStatus status,
                               String profileColor, String nickname, String organization, Portfolio portfolio,
                               Set<TechStack> techStacks, List<WorkExperience> workExperiences) {
        this.id = id;
        this.projectId = projectId;
        this.position = position;
        this.message = message;
        this.status = status;
        this.profileColor = profileColor;
        this.nickname = nickname;
        this.organization = organization;
        this.portfolio = portfolio;
        this.techStacks = techStacks;
        this.workExperiences = workExperiences;
    }

    public static ApplicationResponse from(Application application, S3Service s3Service) {
        Profile profile = application.getProfileFromSnapshot();
        ApplicationResponse.ApplicationResponseBuilder builder = ApplicationResponse.builder()
                .id(application.getId())
                .projectId(application.getProject().getId())
                .position(application.getPosition())
                .message(application.getMessage())
                .status(application.getStatus())
                .profileColor(profile.getProfileColor())
                .nickname(profile.getNickname())
                .organization(profile.getOrganization())
                .techStacks(profile.getTechStacks())
                .workExperiences(profile.getWorkExperiences());

        Portfolio portfolio = profile.getPortfolio();
        if (portfolio != null) {
            String presignedUrl = s3Service.getPresignedUrl(portfolio.getUrl());
            builder.portfolio(new Portfolio(presignedUrl, portfolio.getFileName()));
        }

        return builder.build();
    }
}
