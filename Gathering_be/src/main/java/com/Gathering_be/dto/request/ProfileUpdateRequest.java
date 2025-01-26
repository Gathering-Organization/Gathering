package com.Gathering_be.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProfileUpdateRequest {
    private String nickname;

    @Size(max = 1000, message = "자기소개는 1000자 이하여야 합니다.")
    private String introduction;

    private List<WorkExperienceRequest> workExperiences;

    @Builder
    public ProfileUpdateRequest(String nickname, String introduction, List<WorkExperienceRequest> workExperiences) {
        this.nickname = nickname;
        this.introduction = introduction;
        this.workExperiences = workExperiences;
    }
}