package com.Gathering_be.global.exception;

import com.Gathering_be.global.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestCookieException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static com.Gathering_be.global.exception.ErrorCode.*;
import static org.springframework.http.HttpStatus.BAD_REQUEST;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    private static final String LOG_FORMAT = "Class = {}, Status = {}, Message = {}, RequestURL = {}, User = {}, Path = {}";
    private static final String DETAILED_ERROR_FORMAT = """
            [Exception Detail]
            Time: {}
            Class: {}
            Status: {}
            Message: {}
            Request URL: {}
            HTTP Method: {}
            User: {}
            Client IP: {}
            Path: {}
            Headers: {}
            """;

    @Autowired
    private HttpServletRequest request;

    private String getRequestUrl() {
        if (request != null) {
            return request.getRequestURL().toString();
        }
        return "Unknown URL";
    }

    private String getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getName() != null) {
            return authentication.getName();
        }
        return "Anonymous";
    }

    private String getClientIP() {
        if (request != null) {
            String ip = request.getHeader("X-Real-IP");
            if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getRemoteAddr();
            }
            return ip;
        }
        return "Unknown IP";
    }

    private String getHeadersInfo() {
        StringBuilder headers = new StringBuilder();
        if (request != null) {
            Collections.list(request.getHeaderNames()).forEach(headerName ->
                    headers.append(headerName).append(": ").append(request.getHeader(headerName)).append(", ")
            );
        }
        return headers.toString();
    }

    @ExceptionHandler(NoResourceFoundException.class)
    protected ResponseEntity<ErrorResponse> handleNoResourceFoundException(NoResourceFoundException e) {
        String requestUrl = getRequestUrl();
        String user = getCurrentUser();
        String clientIP = getClientIP();
        String headers = getHeadersInfo();
        String path = request != null ? request.getServletPath() : "Unknown path";
        String httpMethod = request != null ? request.getMethod() : "Unknown method";

        log.error(DETAILED_ERROR_FORMAT,
                LocalDateTime.now(),
                e.getClass().getSimpleName(),
                HttpStatus.NOT_FOUND.value(),
                e.getMessage(),
                requestUrl,
                httpMethod,
                user,
                clientIP,
                path,
                headers
        );

        List<ErrorResponse.CustomFieldError> errors = new ArrayList<>();
        errors.add(new ErrorResponse.CustomFieldError(
                "path",
                path,
                String.format("요청하신 경로 %s를 찾을 수 없습니다.", path)
        ));
        errors.add(new ErrorResponse.CustomFieldError(
                "method",
                httpMethod,
                String.format("%s 메소드는 이 경로에서 지원하지 않습니다.", httpMethod)
        ));

        ErrorResponse response = ErrorResponse.of(RESOURCE_NOT_FOUND, errors);

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler
    protected ResponseEntity<ErrorResponse> handleMissingServletRequestParameterException(
            MissingServletRequestParameterException e) {
        ErrorResponse response = ErrorResponse.of(INPUT_VALUE_INVALID, e.getParameterName());
        logError(e, response);

        return new ResponseEntity<>(response, BAD_REQUEST);
    }

    @ExceptionHandler
    protected ResponseEntity<ErrorResponse> handleConstraintViolationException(
            ConstraintViolationException e) {
        ErrorResponse response = ErrorResponse.of(INPUT_VALUE_INVALID, e.getConstraintViolations());
        logError(e, response);

        return new ResponseEntity<>(response, BAD_REQUEST);
    }

    @ExceptionHandler
    protected ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException e) {
        ErrorResponse response = ErrorResponse.of(INPUT_VALUE_INVALID, e.getBindingResult());
        logError(e, response);

        return new ResponseEntity<>(response, BAD_REQUEST);
    }

    @ExceptionHandler
    protected ResponseEntity<ErrorResponse> handleBindException(
            BindException e) {
        ErrorResponse response = ErrorResponse.of(INPUT_VALUE_INVALID, e.getBindingResult());
        logError(e, response);
        return new ResponseEntity<>(response, BAD_REQUEST);
    }

    @ExceptionHandler
    protected ResponseEntity<ErrorResponse> handleMissingServletRequestPartException(
            MissingServletRequestPartException e) {
        ErrorResponse response = ErrorResponse.of(INPUT_VALUE_INVALID, e.getRequestPartName());
        logError(e, response);

        return new ResponseEntity<>(response, BAD_REQUEST);
    }

    @ExceptionHandler
    protected ResponseEntity<ErrorResponse> handleMissingRequestCookieException(
            MissingRequestCookieException e) {
        ErrorResponse response = ErrorResponse.of(INPUT_VALUE_INVALID, e.getCookieName());
        logError(e, response);

        return new ResponseEntity<>(response, BAD_REQUEST);
    }

    @ExceptionHandler
    protected ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatchException(
            MethodArgumentTypeMismatchException e) {
        ErrorResponse response = ErrorResponse.of(e);
        logError(e, response);

        return new ResponseEntity<>(response, BAD_REQUEST);
    }

    @ExceptionHandler
    protected ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException e) {
        ErrorResponse response = ErrorResponse.of(HTTP_MESSAGE_NOT_READABLE);
        logError(e, response);

        return new ResponseEntity<>(response, BAD_REQUEST);
    }

    @ExceptionHandler
    protected ResponseEntity<ErrorResponse> handleHttpRequestMethodNotSupportedException(
            HttpRequestMethodNotSupportedException e) {
        List<ErrorResponse.CustomFieldError> errors = new ArrayList<>();
        errors.add(new ErrorResponse.CustomFieldError(
                "HTTP METHOD", e.getMethod(), METHOD_NOT_ALLOWED.getMessage()));
        ErrorResponse response = ErrorResponse.of(HTTP_HEADER_INVALID, errors);
        logError(e, response);

        return new ResponseEntity<>(response, BAD_REQUEST);
    }

    @ExceptionHandler
    protected ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e) {
        ErrorCode errorCode = e.getErrorCode();
        ErrorResponse response = ErrorResponse.of(errorCode, e.getErrors());
        logError(e, response);

        return new ResponseEntity<>(response, HttpStatus.valueOf(errorCode.getStatus()));
    }

    @ExceptionHandler
    protected ResponseEntity<ErrorResponse> handleException(Exception e) {
        ErrorResponse response = ErrorResponse.of(INTERNAL_SERVER_ERROR);
        logError(e, response);
        log.error("Unhandled exception occurred", e);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private void logError(Exception e, ErrorResponse response) {
        String requestUrl = getRequestUrl();
        String user = getCurrentUser();
        String path = request != null ? request.getServletPath() : "Unknown path";

        log.error(LOG_FORMAT,
                e.getClass().getSimpleName(),
                response.getStatus(),
                response.getMessage(),
                requestUrl,
                user,
                path
        );
    }
}