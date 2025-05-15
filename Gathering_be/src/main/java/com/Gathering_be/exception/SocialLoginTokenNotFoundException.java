package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class SocialLoginTokenNotFoundException extends BusinessException {

    public SocialLoginTokenNotFoundException() {
        super(ErrorCode.SOCIAL_LOGIN_TOKEN_NOT_FOUND);
    }
}