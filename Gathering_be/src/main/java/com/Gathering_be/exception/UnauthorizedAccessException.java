package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class UnauthorizedAccessException extends BusinessException {
    public UnauthorizedAccessException() {
        super(ErrorCode.UNAUTHORIZED_ACCESS);
    }
}
