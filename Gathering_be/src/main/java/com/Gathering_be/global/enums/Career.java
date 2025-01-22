package com.Gathering_be.global.enums;

import lombok.Getter;

@Getter
public enum Career {
    NEWCOMER("0년차"),
    ONE_YEAR("1년차"),
    TWO_YEARS("2년차"),
    THREE_YEARS("3년차"),
    FOUR_YEARS("4년차"),
    FIVE_YEARS("5년차"),
    SIX_YEARS("6년차"),
    SEVEN_YEARS("7년차"),
    EIGHT_YEARS("8년차"),
    NINE_YEARS("9년차"),
    TEN_PLUS_YEARS("10년차 이상");

    private final String description;

    Career(String description) {
        this.description = description;
    }
}