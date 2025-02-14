package com.Gathering_be.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class InterestProjectRequest {
    private Long projectId;

    @Builder
    public InterestProjectRequest(Long projectId) {
        this.projectId = projectId;
    }
}
