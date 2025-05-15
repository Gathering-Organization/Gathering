package com.Gathering_be.global.enums;

public enum ApplyStatus {
    PENDING("대기중"),
    APPROVED("승인됨"),
    REJECTED("거절됨");

    private final String description;

    ApplyStatus(String description) {
        this.description = description;
    }
}
