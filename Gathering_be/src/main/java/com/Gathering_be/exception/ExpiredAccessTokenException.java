package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class ExpiredAccessTokenException extends BusinessException {
    public ExpiredAccessTokenException() {
        super(ErrorCode.EXPIRED_ACCESS_TOKEN);
    }
}