package com.Gathering_be.service;

import com.Gathering_be.domain.Member;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.dto.request.LinkAccountRequest;
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
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;

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
        String verified = redisService.getValues("verified:" + request.getEmail() + request.getCode());
        if (verified == null) { throw new EmailNotVerified(); }

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

        Optional<Member> existingMemberOpt = memberRepository.findByEmail(email);

        if (existingMemberOpt.isPresent()) {
            // --- 이미 해당 이메일로 가입된 회원이 있을 경우 ---
            Member member = existingMemberOpt.get();

            if (member.getProviders().contains(OAuthProvider.GOOGLE)) {
                // [시나리오 1] 이미 Google 계정이 연결된 경우 -> 정상 로그인 처리
                return createAndSaveTokens(member);
            } else {
                // [시나리오 2] Google 계정이 연결되지 않은 경우 (예: BASIC 가입자)
                // "계정 연결이 필요합니다" 라는 특정 예외를 발생시켜 프론트엔드에 알려줍니다.
                throw new AccountNeedsLinkingException();
            }
        } else {
            // --- 신규 회원일 경우 ---
            Member newMember = Member.oAuthBuilder()
                    .email(email)
                    .name(name)
                    .provider(OAuthProvider.GOOGLE)
                    .build();
            Member savedMember = memberRepository.save(newMember);
            createDefaultProfile(savedMember);
            return createAndSaveTokens(savedMember);
        }
    }

    // 토큰 생성 및 저장을 위한 private 헬퍼 메서드
    private TokenResponse createAndSaveTokens(Member member) {
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

        if (!member.getProviders().contains(OAuthProvider.BASIC)) {
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

    /**
     * 사용자가 비밀번호를 입력하여 기존 계정에 Google 계정을 연결합니다.
     * @param request 이메일과 비밀번호가 담긴 DTO
     */
    @Transactional
    public void linkGoogleAccount(LinkAccountRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();

        // 1. 해당 이메일로 기존 회원을 찾습니다.
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(MemberNotFoundException::new);

        // 2. 입력된 비밀번호가 맞는지 확인합니다.
        if (!passwordEncoder.matches(password, member.getPassword())) {
            throw new InvalidCredentialsException();
        }

        // 3. 비밀번호가 맞으면, 이 회원의 로그인 방식에 GOOGLE을 추가합니다.
        member.addProvider(OAuthProvider.GOOGLE);
    }
}