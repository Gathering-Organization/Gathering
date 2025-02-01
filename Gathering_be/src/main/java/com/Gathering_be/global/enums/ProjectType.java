package com.Gathering_be.global.enums;

import lombok.Getter;

@Getter
public enum ProjectType {
    HACKATHON("헤커톤"),
    STUDY("스터디"),
    PROJECT("프로젝트"),
    CONTEST("공모전"),
    OTHER("기타");

    private final String description;

    ProjectType(String description) { this.description = description; }
}
