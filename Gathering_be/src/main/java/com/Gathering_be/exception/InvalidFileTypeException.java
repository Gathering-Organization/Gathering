package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class InvalidFileTypeException extends BusinessException {
    public InvalidFileTypeException() {
        super(ErrorCode.INVALID_FILE_TYPE);
    }
}
