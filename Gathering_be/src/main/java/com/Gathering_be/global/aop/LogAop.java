package com.Gathering_be.global.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Component
@Aspect
@Slf4j
public class LogAop {


    @Around("(execution(* com.Gathering_be.controller..*(..)) || execution(* com.Gathering_be.service..*(..)))")
    public Object execute(ProceedingJoinPoint joinPoint) throws Throwable {
        log.info("START: {}", joinPoint.toString());
        try {
            return joinPoint.proceed();
        } finally {
            log.info("END: {}", joinPoint.toString());
        }
    }
}