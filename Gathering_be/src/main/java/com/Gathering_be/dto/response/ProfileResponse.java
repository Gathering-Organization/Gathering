package com.Gathering_be.dto.response;

import com.Gathering_be.domain.Portfolio;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.global.enums.TechStack;
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
    private Set<TechStack> techStacks;
    private Portfolio portfolio;
    private List<WorkExperienceResponse> workExperiences;

    @Builder
    public ProfileResponse(String profileColor, String nickname, String introduction,
                           boolean isPublic, String organization, Set<TechStack> techStacks,
                           Portfolio portfolio, List<WorkExperienceResponse> workExperiences) {
        this.profileColor = profileColor;
        this.nickname = nickname;
        this.introduction = introduction;
        this.isPublic = isPublic;
        this.organization = organization;
        this.techStacks = techStacks;
        this.portfolio = portfolio;
        this.workExperiences = workExperiences;
    }

    public static ProfileResponse from(Profile profile, boolean isMyProfile) {
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
        }

        if (isMyProfile) {
            builder.portfolio(profile.getPortfolio());
        }

        return builder.build();
    }
}
