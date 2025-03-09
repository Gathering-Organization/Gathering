package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class InvalidEmailException extends BusinessException {
    public InvalidEmailException() {
        super(ErrorCode.INVALID_EMAIL);
    }
}
