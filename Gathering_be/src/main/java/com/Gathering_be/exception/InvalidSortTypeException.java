package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class InvalidSortTypeException extends BusinessException {
    public InvalidSortTypeException() {
        super(ErrorCode.INVALID_SORT_TYPE);
    }
}
