package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class InterestProjectNotFoundException extends BusinessException {
    public InterestProjectNotFoundException() {
        super(ErrorCode.INTEREST_PROJECT_NOT_FOUND);
    }
}
