package com.Gathering_be.exception;

import com.Gathering_be.global.common.BaseTimeEntity;
import com.Gathering_be.global.exception.BusinessException;
import com.Gathering_be.global.exception.ErrorCode;

public class FileUploadException extends BusinessException {
    public FileUploadException(){
        super(ErrorCode.FILE_SIZE_EXCEED);
    }
}
