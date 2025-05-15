package com.Gathering_be.global.enums;

public enum SearchType {
    TITLE("제목"),
    CONTENT("내용"),
    TITLE_CONTENT("제목+내용"),
    ;

    private final String description;

    SearchType(String description) { this.description = description; }
}
