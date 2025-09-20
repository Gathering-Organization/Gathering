package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class AccountNeedsLinkingException extends BusinessException {
    public AccountNeedsLinkingException() {
        super(ErrorCode.ACCOUNT_NEEDS_LINKING);
    }
}
