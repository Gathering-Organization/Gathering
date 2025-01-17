package com.Gathering_be.dto.response;

public record TokenResponse(
        String accessToken,
        String refreshToken
) {
}