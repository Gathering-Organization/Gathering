package com.Gathering_be.dto.request;

import com.Gathering_be.global.enums.JobPosition;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ApplicationRequest {
    private Long projectId;
    private JobPosition position;
    private String message;
}