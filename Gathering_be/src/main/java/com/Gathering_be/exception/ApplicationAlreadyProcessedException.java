package com.Gathering_be.exception;

import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class ApplicationAlreadyProcessedException extends BusinessException {
  public ApplicationAlreadyProcessedException() {
    super(ErrorCode.APPLICATION_ALREADY_PROCESSED);
  }
}
