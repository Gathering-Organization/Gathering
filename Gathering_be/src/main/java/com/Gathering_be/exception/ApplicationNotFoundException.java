package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class ApplicationNotFoundException extends BusinessException {
    public ApplicationNotFoundException() {
        super(ErrorCode.APPLICATION_NOT_FOUND);
    }
}
