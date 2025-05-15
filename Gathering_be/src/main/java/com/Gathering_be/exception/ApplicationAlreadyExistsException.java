package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class ApplicationAlreadyExistsException extends BusinessException {
    public ApplicationAlreadyExistsException() {
        super(ErrorCode.APPLICATION_ALREADY_EXISTS);
    }
}
