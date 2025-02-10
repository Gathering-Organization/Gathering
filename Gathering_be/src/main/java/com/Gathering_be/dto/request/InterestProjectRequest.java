package com.Gathering_be.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class InterestProjectRequest {
    private String nickname;
    private Long projectId;

    @Builder
    public InterestProjectRequest(String nickname, Long projectId) {
        this.nickname = nickname;
        this.projectId = projectId;
    }
}
