package com.Gathering_be.global.enums;

import lombok.Getter;

@Getter
public enum JobPosition {
    FRONTEND("프론트엔드"),
    BACKEND("백엔드"),
    DESIGNER("디자이너"),
    MARKETER("마케터"),
    PLANNER("기획자"),
    AI("AI"),
    DATA_SCIENTIST("데이터 분석"),
    IOS("iOS"),
    ANDROID("안드로이드"),
    DEVOPS("데브옵스"),
    PM("PM"),
    ISSUE_RESEARCHER("이슈 리서처");

    private final String description;

    JobPosition(String description) {
        this.description = description;
    }
}