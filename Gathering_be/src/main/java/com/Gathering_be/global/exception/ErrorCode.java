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
    UNAUTHORIZED_ACCESS(403, "AU007", "해당 리소스에 대한 접근 권한이 없습니다."),
    INVALID_VERIFICATION_CODE(400, "AU008", "올바르지 않은 인증 코드입니다."),
    EMAIL_NOT_VERIFIED(400, "AU009", "이메일 인증이 완료되지 않았습니다."),
    INVALID_EMAIL(400, "AU009", "유효하지 않은 이메일 형식입니다."),
    ACCOUNT_NEEDS_LINKING(400, "AU010", "이미 해당 이메일로 회원가입이 되어있어 구글 로그인과의 연동이 필요합니다."),

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
    PROFILE_SERIALIZE_FAILED(500, "P003", "프로필 직렬화에 실패했습니다."),
    PROFILE_DESERIALIZE_FAILED(500, "P004", "프로필 역직렬화에 실패했습니다."),

    // Project
    PROJECT_NOT_FOUND(404, "PJ001", "존재하지 않는 프로젝트입니다."),
    INVALID_SEARCH_TYPE(400, "PJ002", "잘못된 검색 타입입니다."),
    INVALID_SORT_TYPE(400, "PJ003", "잘못된 정렬 타입입니다."),
    PROJECT_HAS_APPLICANTS(409, "PJ004", "해당 모집글에 지원한 사용자가 있어 삭제할 수 없습니다."),

    // Interest Project
    INTEREST_PROJECT_NOT_FOUND(404, "IP001", "관심 프로젝트를 찾을 수 없습니다."),
    DUPLICATE_INTEREST_PROJECT(400, "IP002", "이미 관심 프로젝트로 등록되었습니다."),

    // Application
    APPLICATION_ALREADY_EXISTS(400, "AP001", "이미 존재하는 지원서입니다."),
    SELF_APPLICATION_NOT_ALLOWED(400, "AP002", "자신이 만든 프로젝트에는 지원할 수 없습니다."),
    APPLICATION_NOT_FOUND(404, "AP003", "존재하지 않는 지원서입니다."),
    APPLICATION_ALREADY_PROCESSED(400, "AP005", "이미 처리된 지원서는 변경할 수 없습니다."),

    // Enum
    INVALID_ENUM_VALUE(400, "EN001", "잘못된 Enum 입력값입니다."),

    // Mail
    EMAIL_SEND_FAILED(500, "EM001", "이메일 전송 중 오류가 발생했습니다."),

    // Notification
    NOTIFICATION_NOT_FOUND(404, "NT001", "존재하지 않는 알림입니다."),
    ;

    private final int status;
    private final String code;
    private final String message;
}