package com.Gathering_be.global.exception;

import com.Gathering_be.global.response.ErrorResponse;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class BusinessException extends RuntimeException{

    private final ErrorCode errorCode;
    private List<ErrorResponse.CustomFieldError> errors = new ArrayList<>();

    public BusinessException(String message, ErrorCode errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public BusinessException(ErrorCode errorCode, List<ErrorResponse.CustomFieldError> errors) {
        super(errorCode.getMessage());
        this.errors = errors;
        this.errorCode = errorCode;
    }
}