package com.Gathering_be.dto.response;

import com.Gathering_be.domain.InterestProject;
import lombok.Builder;
import lombok.Getter;

@Getter
public class InterestProjectResponse {
    private Long id;
    private String nickname;
    private Long projectId;

    @Builder
    public InterestProjectResponse(Long id, String nickname, Long projectId) {
        this.id = id;
        this.nickname = nickname;
        this.projectId = projectId;
    }

    public static InterestProjectResponse from(InterestProject interestProject) {
        return InterestProjectResponse.builder()
                .id(interestProject.getId())
                .nickname(interestProject.getProfile().getNickname())
                .projectId(interestProject.getProject().getId())
                .build();
    }
}
