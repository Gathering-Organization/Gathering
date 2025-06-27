package com.Gathering_be.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class DebugController {

    // yml 파일로부터 실제 주입된 값을 가져옵니다.
    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;

    @GetMapping("/api/debug/oauth-config")
    public ResponseEntity<Map<String, String>> getOauthConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("현재_백엔드에_설정된_redirect_uri", redirectUri);
        return ResponseEntity.ok(config);
    }
}
