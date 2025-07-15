package com.Gathering_be.global.enums;

public enum NotificationType {
    NEW_APPLICATION("새로운 지원서"),
    APPLICATION_RESULT("지원 결과"),
    PROJECT_CLOSED("프로젝트 마감"),
    PROJECT_DELETED("프로젝트 삭제");

    private final String description;
    NotificationType(String description) { this.description = description; }
}
