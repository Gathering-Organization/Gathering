package com.Gathering_be.global.enums;

import lombok.Getter;

@Getter
public enum ProjectType {
    PROJECT("프로젝트"),
    CONTEST("대회"),
    STUDY("스터디"),
    OTHER("기타");

    private final String description;

    ProjectType(String description) { this.description = description; }
}
