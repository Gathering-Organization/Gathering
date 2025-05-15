package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class InvalidSearchTypeException extends BusinessException {
    public InvalidSearchTypeException() {
        super(ErrorCode.INVALID_SEARCH_TYPE);
    }
}
