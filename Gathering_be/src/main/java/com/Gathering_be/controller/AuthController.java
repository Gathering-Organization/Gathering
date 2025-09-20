package com.Gathering_be.controller;

import com.Gathering_be.dto.request.LinkAccountRequest;
import com.Gathering_be.dto.request.LoginRequest;
import com.Gathering_be.dto.request.SignUpRequest;
import com.Gathering_be.dto.response.TokenResponse;
import com.Gathering_be.global.response.ResultCode;
import com.Gathering_be.global.response.ResultResponse;
import com.Gathering_be.service.AuthService;
import com.Gathering_be.service.EmailVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final EmailVerificationService emailVerificationService;

    @GetMapping("/login/google")
    public ResponseEntity<ResultResponse> googleLogin(@RequestParam("accessToken") String accessToken) {
        TokenResponse tokenResponse = authService.googleLogin(accessToken);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.SOCIAL_LOGIN_SUCCESS, tokenResponse));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ResultResponse> refresh(@RequestHeader("Authorization") String refreshToken) {
        TokenResponse tokenResponse = authService.refresh(refreshToken);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.TOKEN_REISSUED_SUCCESS, tokenResponse));
    }

    @PostMapping("/logout")
    public ResponseEntity<ResultResponse> logout(@RequestHeader("Authorization") String accessToken) {
        authService.logout(accessToken);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.LOGOUT_SUCCESS));
    }

    @PostMapping("/signup")
    public ResponseEntity<ResultResponse> signUp(@Valid @RequestBody SignUpRequest request) {
        authService.signUp(request);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.SIGNUP_SUCCESS));
    }

    @PostMapping("/login")
    public ResponseEntity<ResultResponse> login(@Valid @RequestBody LoginRequest request) {
        TokenResponse tokenResponse = authService.login(request);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.LOGIN_SUCCESS, tokenResponse));
    }

    @PostMapping("/link/google")
    public ResponseEntity<ResultResponse> linkGoogleAccount(@RequestBody LinkAccountRequest request) {
        authService.linkGoogleAccount(request);
        return ResponseEntity.ok(ResultResponse.of(ResultCode.ACCOUNT_LINK_SUCCESS));
    }
}