package com.Gathering_be.exception;


import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class FileSizeExceededException extends BusinessException {
    public FileSizeExceededException() {
        super(ErrorCode.FILE_SIZE_EXCEED);
    }
}
