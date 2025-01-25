package com.Gathering_be.dto.response;

import com.Gathering_be.domain.Member;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.global.enums.JobPosition;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProfileResponse {
    private String email;
    private String name;
    private String nickname;
    private JobPosition jobPosition;
    private String organization;
    private String introduction;
    private Set<String> techStacks;
    private String profileImageUrl;
    private String profileColor;
    private String portfolioUrl;
    private List<WorkExperienceResponse> workExperiences;
    private boolean isPublic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder
    public ProfileResponse(String email, String name, String nickname,
                           JobPosition jobPosition, String organization,
                           String introduction, Set<String> techStacks,
                           String profileImageUrl, String profileColor,
                           String portfolioUrl, List<WorkExperienceResponse> workExperiences,
                           boolean isPublic, LocalDateTime createdAt,
                           LocalDateTime updatedAt) {
        this.email = email;
        this.name = name;
        this.nickname = nickname;
        this.jobPosition = jobPosition;
        this.organization = organization;
        this.introduction = introduction;
        this.techStacks = techStacks;
        this.profileImageUrl = profileImageUrl;
        this.profileColor = profileColor;
        this.portfolioUrl = portfolioUrl;
        this.workExperiences = workExperiences;
        this.isPublic = isPublic;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static ProfileResponse from(Member member, Profile profile) {
        List<WorkExperienceResponse> workExperiences = profile.isPublic() ?
                profile.getWorkExperiences().stream()
                        .map(WorkExperienceResponse::from)
                        .collect(Collectors.toList()) : null;

        return ProfileResponse.builder()
                .email(profile.isPublic() ? member.getEmail() : null)
                .name(profile.isPublic() ? member.getName() : null)
                .nickname(member.getNickname())
                .jobPosition(profile.getJobPosition())
                .organization(profile.isPublic() ? profile.getOrganization() : null)
                .introduction(profile.isPublic() ? profile.getIntroduction() : null)
                .techStacks(profile.getTechStacks())
                .profileImageUrl(profile.isPublic() ? profile.getProfileImageUrl() : null)
                .profileColor(profile.getProfileColor())
                .portfolioUrl(profile.isPublic() ? profile.getPortfolioUrl() : null)
                .workExperiences(workExperiences)
                .isPublic(profile.isPublic())
                .createdAt(member.getCreatedAt())
                .updatedAt(member.getUpdatedAt())
                .build();
    }
}