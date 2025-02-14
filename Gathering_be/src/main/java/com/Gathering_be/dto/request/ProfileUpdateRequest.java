package com.Gathering_be.dto.request;

import com.Gathering_be.global.enums.TechStack;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Set;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProfileUpdateRequest {
    private String nickname;

    @Size(max = 1000, message = "자기소개는 1000자 이하여야 합니다.")
    private String introduction;

    private String organization;
    private Set<TechStack> techStacks;
    private List<WorkExperienceRequest> workExperiences;

    @Pattern(regexp = "^[0-9A-Fa-f]{6}$", message = "색상 코드는 000000-FFFFFF 범위의 16진수여야 합니다.")
    private String profileColor;

    @Builder
    public ProfileUpdateRequest(String nickname, String introduction,
                                String organization, Set<TechStack> techStacks,
                                List<WorkExperienceRequest> workExperiences) {
        this.nickname = nickname;
        this.introduction = introduction;
        this.organization = organization;
        this.techStacks = techStacks;
        this.workExperiences = workExperiences;
    }
}