package com.Gathering_be.global.response;

import com.Gathering_be.global.exception.ErrorCode;
import lombok.Getter;

@Getter
public class ResultResponse {

    private final int status;
    private final String code;
    private final String message;
    private final Object data;

    public ResultResponse(ResultCode resultCode, Object data) {
        this.status = resultCode.getStatus();
        this.code = resultCode.getCode();
        this.message = resultCode.getMessage();
        this.data = data;
    }

    public ResultResponse(ErrorCode errorCode, Object data) {
        this.status = errorCode.getStatus();
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
        this.data = data;
    }

    public static ResultResponse of(ResultCode resultCode, Object data) {
        return new ResultResponse(resultCode, data);
    }

    public static ResultResponse of(ResultCode resultCode) {
        return new ResultResponse(resultCode, "");
    }

    public static ResultResponse of(ErrorCode errorCode) { return new ResultResponse(errorCode, ""); }
}