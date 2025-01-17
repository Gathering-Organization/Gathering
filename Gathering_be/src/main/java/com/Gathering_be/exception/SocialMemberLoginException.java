package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class SocialMemberLoginException extends BusinessException {
    public SocialMemberLoginException() {
        super(ErrorCode.SOCIAL_MEMBER_LOGIN);
    }
}