package com.Gathering_be.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ApplicationRequest {
    private Long projectId;
    private String position;
    private String message;
}