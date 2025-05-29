package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class ProjectHasApplicantsException extends BusinessException {
    public ProjectHasApplicantsException() { super(ErrorCode.PROJECT_HAS_APPLICANTS); }
}
