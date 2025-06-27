package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class ProfileDeserializeFailedException extends BusinessException {
    public ProfileDeserializeFailedException() {
        super(ErrorCode.PROFILE_DESERIALIZE_FAILED);
    }
}
