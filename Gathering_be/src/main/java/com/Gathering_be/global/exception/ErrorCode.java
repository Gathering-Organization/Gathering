package com.Gathering_be.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // Global
    INTERNAL_SERVER_ERROR(500, "G001", "내부 서버 오류입니다."),
    METHOD_NOT_ALLOWED(405, "G002", "허용되지 않은 HTTP method입니다."),
    INPUT_VALUE_INVALID(400, "G003", "유효하지 않은 입력입니다."),
    INPUT_TYPE_INVALID(400, "G004", "입력 타입이 유효하지 않습니다."),
    HTTP_MESSAGE_NOT_READABLE(400, "G005", "request message body가 없거나, 값 타입이 올바르지 않습니다."),
    HTTP_HEADER_INVALID(400, "G006", "request header가 유효하지 않습니다."),
    RESOURCE_NOT_FOUND(404, "G007", "요청한 리소스를 찾을 수 없습니다."),
    SOCIAL_LOGIN_TOKEN_NOT_FOUND(500, "G019", "소셜 로그인 서버로부터 발급된 Access Token이 없습니다."),
    SOCIAL_LOGIN_USER_INFO_NOT_FOUND(500, "G020", "소셜 로그인 서버에서 조회한 유저 정보가 없습니다."),

    // Auth
    INVALID_TOKEN(400, "AU001", "유효하지 않은 토큰입니다."),
    ACCESS_DENIED(401, "AU005", "유효한 인증 정보가 아닙니다."),
    EXPIRED_ACCESS_TOKEN(401, "AU006", "Access Token이 만료되었습니다. 토큰을 재발급해주세요"),
    DUPLICATE_EMAIL(400, "AU004", "이미 사용중인 이메일입니다."),
    INVALID_CREDENTIALS(401, "AU005", "이메일 또는 비밀번호가 올바르지 않습니다."),
    SOCIAL_MEMBER_LOGIN(400, "AU006", "소셜 로그인으로 가입된 계정입니다. 해당 소셜 로그인을 이용해주세요."),

    // Member
    MEMBER_NOT_FOUND(404, "M001", "존재하지 않는 유저입니다."),

    // File Upload
    FILE_UPLOAD_ERROR(500, "F001", "파일 업로드에 실패했습니다."),
    FILE_DELETE_ERROR(500, "F002", "파일 삭제에 실패했습니다."),
    INVALID_FILE_TYPE(400, "F003", "지원하지 않는 파일 형식입니다."),
    FILE_SIZE_EXCEED(400, "F004", "파일 크기가 제한을 초과했습니다."),
    FILE_NOT_FOUND(404, "F005", "파일을 찾을 수 없습니다."),

    //Profile
    PROFILE_NOT_FOUND(404, "P001", "존재하지 않는 프로필입니다."),
    PROFILE_ACCESS_DENIED(403, "P002", "비공개 프로필은 조회할 수 없습니다."),


    ;

    private final int status;
    private final String code;
    private final String message;
}