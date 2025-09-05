package com.Gathering_be.global.config;

import com.Gathering_be.global.jwt.JwtTokenFilter;
import com.Gathering_be.global.jwt.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    @Value("${gathering.swagger.username}")
    private String swaggerUser;

    @Value("${gathering.swagger.password}")
    private String swaggerPassword;

    private static final String[] PERMITTED_API_URL = {
            "/api/auth/**",
            "/api/verify/**",
            "/actuator/prometheus",
            "/api/project/pagination",
            "/api/profile/nickname/**",
    };

    // [신 기능 추가] 개발 환경에서만 H2 콘솔 접근을 허용하는 필터 체인
    @Bean
    @Order(0) // 다른 필터 체인보다 먼저 평가되도록 순서를 가장 높게 설정합니다.
    @Profile("dev") // 'dev' 프로필일 때만 이 Bean을 활성화합니다.
    public SecurityFilterChain h2ConsoleSecurityFilterChain(HttpSecurity http) throws Exception {
        return http
                .securityMatcher("/h2-console/**") // 이 규칙은 /h2-console 경로에만 적용됩니다.
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // /h2-console/** 의 모든 요청을 허용합니다.
                )
                .csrf(AbstractHttpConfigurer::disable)
                // [핵심] X-Frame-Options 헤더 비활성화하여 iframe 렌더링을 허용합니다.
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.disable())
                )
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("https://gathering.work", "https://www.gathering.work", "http://localhost:3000", "http://127.0.0.1:5500"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    @Order(1)
    public SecurityFilterChain swaggerFilterChain(HttpSecurity http) throws Exception {
        return http
                .securityMatcher("/swagger-ui/**", "/v3/api-docs/**")
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().authenticated()
                )
                .httpBasic(basic -> basic
                        .realmName("Swagger UI")
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .csrf(AbstractHttpConfigurer::disable)
                .build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain apiFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorizeRequest ->
                        authorizeRequest
                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                .requestMatchers(PERMITTED_API_URL).permitAll()
                                .anyRequest().authenticated()
                )
                .sessionManagement(sessionManagement ->
                        sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .exceptionHandling(handling -> handling
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("Authentication failed");
                        })
                )
                .addFilterBefore(new JwtTokenFilter(jwtTokenProvider, new ObjectMapper()), UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public InMemoryUserDetailsManager swaggerUserDetailsManager() {
        UserDetails user = User.withUsername(swaggerUser)
                .password(passwordEncoder().encode(swaggerPassword))
                .roles("SWAGGER")
                .build();
        return new InMemoryUserDetailsManager(user);
    }
}