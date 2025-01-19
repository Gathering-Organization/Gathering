package com.Gathering_be.global.jwt;

import com.Gathering_be.exception.ExpiredAccessTokenException;
import com.Gathering_be.global.exception.ErrorCode;
import com.Gathering_be.global.response.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Slf4j
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {
        String jwt = resolveToken(request);

        try {
            if (StringUtils.hasText(jwt)) {
                log.info("JWT Token Processing: {}", jwt);

                try {
                    jwtTokenProvider.validateToken(jwt);
                    Authentication authentication = jwtTokenProvider.getAuthentication(jwt);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.info("Valid token for user: {}", authentication.getName());
                } catch (Exception e) {
                    log.error("JWT Token Error: {}", e.getMessage());
                    handleJwtException(response, e);
                    return;
                }
            }
            filterChain.doFilter(request, response);
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    private void handleJwtException(HttpServletResponse response, Exception exception) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setStatus(HttpStatus.UNAUTHORIZED.value());

        ErrorResponse errorResponse;
        if (exception instanceof ExpiredAccessTokenException) {
            log.error("Token Expired Exception");
            errorResponse = ErrorResponse.of(ErrorCode.EXPIRED_ACCESS_TOKEN);
        } else {
            log.error("Invalid Token Exception");
            errorResponse = ErrorResponse.of(ErrorCode.INVALID_TOKEN);
        }

        String jsonResponse = objectMapper.writerWithDefaultPrettyPrinter()
                .writeValueAsString(errorResponse);
        response.getOutputStream().write(jsonResponse.getBytes(StandardCharsets.UTF_8));
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}