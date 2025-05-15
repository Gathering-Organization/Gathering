package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class InvalidVerificationCodeException extends BusinessException {
    public InvalidVerificationCodeException() { super(ErrorCode.INVALID_VERIFICATION_CODE); }
}
