package com.Gathering_be.global.enums;

public enum ProjectMode {
    ONLINE("온라인"),
    OFFLINE("오프라인"),
    BLENDED("온+오프라인"),
    ;
    private final String description;

    ProjectMode(String description) { this.description = description; }
}
