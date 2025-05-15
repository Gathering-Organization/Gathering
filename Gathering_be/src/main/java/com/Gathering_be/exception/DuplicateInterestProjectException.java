package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class DuplicateInterestProjectException extends BusinessException {
    public DuplicateInterestProjectException() { super(ErrorCode.DUPLICATE_INTEREST_PROJECT); }
}
