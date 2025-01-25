package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class ProfileNotFoundException extends BusinessException {
    public ProfileNotFoundException() {
        super(ErrorCode.PROFILE_NOT_FOUND);
    }
}
