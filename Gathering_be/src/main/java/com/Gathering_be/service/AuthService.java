package com.Gathering_be.service;

import com.Gathering_be.domain.Member;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.dto.request.LoginRequest;
import com.Gathering_be.dto.request.SignUpRequest;
import com.Gathering_be.dto.response.TokenResponse;
import com.Gathering_be.exception.*;
import com.Gathering_be.global.enums.OAuthProvider;
import com.Gathering_be.global.jwt.JwtTokenProvider;
import com.Gathering_be.repository.MemberRepository;
import com.Gathering_be.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final String REFRESH_TOKEN_PREFIX = "refresh:";

    private final RestTemplate restTemplate;
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisService redisService;
    private final PasswordEncoder passwordEncoder;
    private final ProfileRepository profileRepository;

    @Value("${oauth2.google.resource-uri}")
    private String googleResourceUri;

    @Transactional
    public void signUp(SignUpRequest request) {
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException();
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        Member member = Member.localBuilder()
                .email(request.getEmail())
                .name(request.getName())
                .password(encodedPassword)
                .build();

        member = memberRepository.save(member);
        createDefaultProfile(member);
    }

    @Transactional
    public TokenResponse googleLogin(String accessToken) {
        Map<String, Object> userInfo = getUserInfo(accessToken);
        String email = (String) userInfo.get("email");
        String name = (String) userInfo.get("name");

        Member member = memberRepository.findByEmail(email)
                .orElseGet(() -> {
                    Member newMember = Member.oAuthBuilder()
                            .email(email)
                            .name(name)
                            .provider(OAuthProvider.GOOGLE)
                            .build();
                    Member savedMember = memberRepository.save(newMember);
                    createDefaultProfile(savedMember);
                    return savedMember;
                });

        String jwtToken = jwtTokenProvider.createAccessToken(member.getId(), member.getRole());
        String refreshToken = jwtTokenProvider.createRefreshToken(member.getId());
        redisService.setValues(REFRESH_TOKEN_PREFIX + member.getId(), refreshToken);
        return new TokenResponse(jwtToken, refreshToken);
    }

    private void createDefaultProfile(Member member) {
        String nickname = generateUniqueNickname(member.getName());
        Profile profile = Profile.builder()
                .member(member)
                .nickname(nickname)
                .profileColor("000000")
                .isPublic(true)
                .build();
        profileRepository.save(profile);
    }

    private String generateUniqueNickname(String baseName) {
        if (!profileRepository.existsByNickname(baseName)) {
            return baseName;
        }

        while (true) {
            int randomNumber = (int) (Math.random() * 900000) + 100000;
            String nickname = baseName + "#" + randomNumber;
            if (!profileRepository.existsByNickname(nickname)) {
                return nickname;
            }
        }
    }

    @Transactional
    public TokenResponse login(LoginRequest request) {
        Member member = memberRepository.findByEmail(request.getEmail())
                .orElseThrow(InvalidCredentialsException::new);

        if (member.getProvider() != OAuthProvider.BASIC) {
            throw new SocialMemberLoginException();
        }

        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new InvalidCredentialsException();
        }

        String accessToken = jwtTokenProvider.createAccessToken(member.getId(), member.getRole());
        String refreshToken = jwtTokenProvider.createRefreshToken(member.getId());

        redisService.setValues(REFRESH_TOKEN_PREFIX + member.getId(), refreshToken);

        return new TokenResponse(accessToken, refreshToken);
    }



    private Map<String, Object> getUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<String> entity = new HttpEntity<>("", headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                googleResourceUri,
                HttpMethod.GET,
                entity,
                Map.class
        );

        if (response.getBody() == null) {
            throw new SocialLoginUserInfoNotFoundException();
        }

        return response.getBody();
    }

    public TokenResponse refresh(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new InvalidTokenException();
        }

        Long memberId = Long.parseLong(jwtTokenProvider.getUserId(refreshToken));
        Member member = getMemberById(memberId);
        String storedRefreshToken = redisService.getValues(REFRESH_TOKEN_PREFIX + member.getId());
        if (storedRefreshToken == null || !storedRefreshToken.equals(refreshToken)) {
            throw new InvalidTokenException();
        }

        String newAccessToken = jwtTokenProvider.createAccessToken(memberId, member.getRole());
        String newRefreshToken = jwtTokenProvider.createRefreshToken(memberId);

        redisService.setValues(REFRESH_TOKEN_PREFIX + member.getId(), newRefreshToken);

        return new TokenResponse(newAccessToken, newRefreshToken);
    }

    public void logout(String accessToken) {
        if (!jwtTokenProvider.validateToken(accessToken)) {
            throw new InvalidTokenException();
        }

        Long memberId = Long.parseLong(jwtTokenProvider.getUserId(accessToken));
        Member member = getMemberById(memberId);
        redisService.deleteValues(REFRESH_TOKEN_PREFIX + member.getId());
    }

    private Member getMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);
    }
}