package com.Gathering_be.dto.request;

import com.Gathering_be.global.enums.Career;
import com.Gathering_be.global.enums.JobPosition;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProfileUpdateRequest {
    @NotNull(message = "직무는 필수입니다.")
    private JobPosition jobPosition;

    @Size(max = 100, message = "소속은 100자 이하여야 합니다.")
    private String organization;

    @NotNull(message = "경력은 필수입니다.")
    private Career career;

    @Size(max = 1000, message = "자기소개는 1000자 이하여야 합니다.")
    private String introduction;

    @Size(min = 1, message = "기술 스택은 최소 1개 이상이어야 합니다.")
    private List<String> techStacks;

    @Pattern(regexp = "^https://github\\.com/.*$", message = "올바른 Github URL을 입력해주세요.")
    private String githubUrl;

    @Pattern(regexp = "^https://.*\\.notion\\.site/.*$", message = "올바른 Notion URL을 입력해주세요.")
    private String notionUrl;

    private String portfolioUrl;

    @Builder
    public ProfileUpdateRequest(JobPosition jobPosition, String organization,
                                Career career, String introduction, List<String> techStacks,
                                String githubUrl, String notionUrl, String portfolioUrl) {
        this.jobPosition = jobPosition;
        this.organization = organization;
        this.career = career;
        this.introduction = introduction;
        this.techStacks = techStacks;
        this.githubUrl = githubUrl;
        this.notionUrl = notionUrl;
        this.portfolioUrl = portfolioUrl;
    }
}
