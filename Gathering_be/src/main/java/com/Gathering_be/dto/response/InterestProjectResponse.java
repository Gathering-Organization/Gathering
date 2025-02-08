package com.Gathering_be.dto.response;

import com.Gathering_be.domain.InterestProject;
import lombok.Builder;
import lombok.Getter;

@Getter
public class InterestProjectResponse {
    private Long id;
    private Long profileId;
    private Long projectId;

    @Builder
    public InterestProjectResponse(Long id, Long profileId, Long projectId) {
        this.id = id;
        this.profileId = profileId;
        this.projectId = projectId;
    }

    public static InterestProjectResponse from(InterestProject interestProject) {
        return InterestProjectResponse.builder()
                .id(interestProject.getId())
                .profileId(interestProject.getProfile().getId())
                .projectId(interestProject.getProject().getId())
                .build();
    }
}
