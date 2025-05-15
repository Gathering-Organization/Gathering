package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class SelfApplicationNotAllowedException extends BusinessException {
    public SelfApplicationNotAllowedException() {
        super(ErrorCode.SELF_APPLICATION_NOT_ALLOWED);
    }
}
