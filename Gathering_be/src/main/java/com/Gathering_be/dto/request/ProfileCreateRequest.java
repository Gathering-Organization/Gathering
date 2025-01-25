package com.Gathering_be.dto.request;

import com.Gathering_be.global.enums.JobPosition;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProfileCreateRequest {
    @NotNull(message = "직무는 필수입니다.")
    private JobPosition jobPosition;

    @Size(max = 100, message = "소속은 100자 이하여야 합니다.")
    private String organization;

    @Size(max = 1000, message = "자기소개는 1000자 이하여야 합니다.")
    private String introduction;

    @Size(min = 1, message = "기술 스택은 최소 1개 이상이어야 합니다.")
    private List<String> techStacks;

    private String profileColor = "000000";
    private String portfolioUrl;
    private List<WorkExperienceRequest> workExperiences;

    @Builder
    public ProfileCreateRequest(JobPosition jobPosition, String organization,
                                String introduction, List<String> techStacks,
                                String profileColor, String portfolioUrl,
                                List<WorkExperienceRequest> workExperiences) {
        this.jobPosition = jobPosition;
        this.organization = organization;
        this.introduction = introduction;
        this.techStacks = techStacks;
        this.profileColor = profileColor != null ? profileColor : "000000";
        this.portfolioUrl = portfolioUrl;
        this.workExperiences = workExperiences;
    }
}