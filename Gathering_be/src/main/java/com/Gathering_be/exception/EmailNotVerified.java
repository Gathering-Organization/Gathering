package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class EmailNotVerified extends BusinessException {
    public EmailNotVerified() { super(ErrorCode.EMAIL_NOT_VERIFIED); }
}
