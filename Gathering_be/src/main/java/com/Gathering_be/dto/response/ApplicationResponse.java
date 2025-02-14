package com.Gathering_be.dto.response;

import com.Gathering_be.domain.Application;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.global.enums.ApplyStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
public class ApplicationResponse {
    private Long id;
    private String nickname;
    private Long projectId;
    private String position;
    private String message;
    private ApplyStatus status;

    @Builder
    public ApplicationResponse(Long id, String nickname, Long projectId, String position, String message, ApplyStatus status) {
        this.id = id;
        this.nickname = nickname;
        this.projectId = projectId;
        this.position = position;
        this.message = message;
        this.status = status;
    }

    public static ApplicationResponse from(Application application) {
        return ApplicationResponse.builder()
                .id(application.getId())
                .nickname(application.getProfile().getNickname())
                .projectId(application.getProject().getId())
                .position(application.getPosition())
                .message(application.getMessage())
                .status(application.getStatus())
                .build();
    }
}
