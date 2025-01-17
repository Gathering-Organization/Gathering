package com.Gathering_be.global.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ResultCode {

    // Auth
    SIGNUP_SUCCESS(200, "AU001", "회원가입에 성공하였습니다."),
    LOGIN_SUCCESS(200, "AU002", "로그인에 성공하였습니다."),
    SOCIAL_LOGIN_SUCCESS(200, "AU003", "소셜 로그인에 성공하였습니다."),
    TOKEN_ISSUED_SUCCESS(200, "AU004", "토큰 발급에 성공하였습니다."),
    TOKEN_REISSUED_SUCCESS(200, "AU005", "토큰 재발급에 성공하였습니다."),
    LOGOUT_SUCCESS(200, "AU006", "로그아웃에 성공하였습니다."),
    ;

    private final int status;
    private final String code;
    private final String message;
}