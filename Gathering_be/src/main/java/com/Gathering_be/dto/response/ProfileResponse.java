package com.Gathering_be.dto.response;

import com.Gathering_be.domain.Profile;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProfileResponse {
    private String profileColor;
    private String nickname;
    private String introduction;
    private boolean isPublic;
    private List<WorkExperienceResponse> workExperiences;

    @Builder
    public ProfileResponse(String profileColor, String nickname, String introduction,
                           boolean isPublic,
                           List<WorkExperienceResponse> workExperiences) {
        this.profileColor = profileColor;
        this.nickname = nickname;
        this.introduction = introduction;
        this.isPublic = isPublic;
        this.workExperiences = workExperiences;
    }

    public static ProfileResponse from(Profile profile, boolean isMyProfile) {
        return ProfileResponse.builder()
                .profileColor(profile.getProfileColor())
                .nickname(profile.getNickname())
                .introduction(profile.getIntroduction())
                .isPublic(profile.isPublic())
                .workExperiences(profile.getWorkExperiences().stream()
                        .map(WorkExperienceResponse::from)
                        .collect(Collectors.toList()))
                .build();
    }
}

