package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class ProfileSerializeFailedException extends BusinessException {
    public ProfileSerializeFailedException() {
        super(ErrorCode.PROFILE_SERIALIZE_FAILED);
    }
}
