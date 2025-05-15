package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class InvalidEnumValue extends BusinessException {
    public InvalidEnumValue() {
        super(ErrorCode.INVALID_ENUM_VALUE);
    }
}
