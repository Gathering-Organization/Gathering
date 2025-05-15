package com.Gathering_be.controller;

import com.Gathering_be.global.response.ResultCode;
import com.Gathering_be.global.response.ResultResponse;
import com.Gathering_be.service.EmailVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/verify")
@RequiredArgsConstructor
public class EmailVerificationController {
    private final EmailVerificationService emailVerificationService;

    @PostMapping("/send")
    public ResponseEntity<ResultResponse> sendVerification(@RequestParam String email) {
        emailVerificationService.sendVerificationCode(email);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.EMAIL_SENT_SUCCESS));
    }

    @PostMapping("/code")
    public ResponseEntity<ResultResponse> verifyCode(@RequestParam String email, @RequestParam String code) {
        emailVerificationService.verifyCode(email, code);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.EMAIL_VERIFY_SUCCESS));
    }
}
