package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class SocialLoginUserInfoNotFoundException extends BusinessException {

    public SocialLoginUserInfoNotFoundException() {
        super(ErrorCode.SOCIAL_LOGIN_USER_INFO_NOT_FOUND);
    }
}