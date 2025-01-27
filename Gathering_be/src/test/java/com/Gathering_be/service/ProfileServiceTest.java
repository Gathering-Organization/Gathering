package com.Gathering_be.service;

import com.Gathering_be.domain.Member;
import com.Gathering_be.domain.Portfolio;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.dto.request.ProfileUpdateRequest;
import com.Gathering_be.dto.response.ProfileResponse;
import com.Gathering_be.exception.ProfileNotFoundException;
import com.Gathering_be.global.service.S3Service;
import com.Gathering_be.repository.ProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {
    @InjectMocks
    private ProfileService profileService;

    @Mock
    private ProfileRepository profileRepository;
    @Mock
    private S3Service s3Service;

    @BeforeEach
    void setUp() {
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);
        SecurityContextHolder.setContext(securityContext);
        given(securityContext.getAuthentication()).willReturn(authentication);
        given(authentication.getName()).willReturn("1");
    }

    @Test
    @DisplayName("프로필 수정 성공")
    void updateProfile_Success() {
        Member member = createMockMember();
        Profile profile = Profile.builder()
                .member(member)
                .nickname("테스트닉네임")
                .profileColor("000000")
                .introduction("테스트 소개")
                .isPublic(true)
                .build();

        ProfileUpdateRequest request = ProfileUpdateRequest.builder()
                .nickname("새닉네임")
                .introduction("새소개")
                .build();

        given(profileRepository.findByMemberId(1L)).willReturn(Optional.of(profile));
        given(profileRepository.existsByNickname(request.getNickname())).willReturn(false);

        profileService.updateProfile(request);

        verify(profileRepository).findByMemberId(1L);
    }

    @Test
    @DisplayName("내 프로필 조회 성공")
    void getMyProfile_Success() {
        Member member = createMockMember();
        Portfolio portfolio = Portfolio.builder()
                .url("test-url")
                .fileName("test.pdf")
                .build();

        Profile profile = Profile.builder()
                .member(member)
                .nickname("테스트닉네임")
                .profileColor("000000")
                .introduction("테스트 소개")
                .portfolio(portfolio)
                .isPublic(true)
                .build();

        given(profileRepository.findByMemberId(1L)).willReturn(Optional.of(profile));

        ProfileResponse response = profileService.getMyProfile();

        assertThat(response).isNotNull();
        assertThat(response.getNickname()).isEqualTo(profile.getNickname());
        assertThat(response.getIntroduction()).isEqualTo(profile.getIntroduction());
        assertThat(response.getPortfolio().getUrl()).isEqualTo(portfolio.getUrl());
        assertThat(response.getPortfolio().getFileName()).isEqualTo(portfolio.getFileName());
    }

    @Test
    @DisplayName("포트폴리오 업로드 성공")
    void uploadPortfolio_Success() {
        Member member = createMockMember();
        Profile profile = Profile.builder()
                .member(member)
                .nickname("테스트닉네임")
                .profileColor("000000")
                .build();

        MockMultipartFile file = new MockMultipartFile(
                "file", "test.pdf", "application/pdf", "test".getBytes());

        given(profileRepository.findByMemberId(1L)).willReturn(Optional.of(profile));
        given(s3Service.uploadFile(anyString(), any(MultipartFile.class)))
                .willReturn("test-url");

        profileService.updatePortfolio(file);

        verify(s3Service).uploadFile(anyString(), any(MultipartFile.class));
        assertThat(profile.getPortfolio().getUrl()).isEqualTo("test-url");
        assertThat(profile.getPortfolio().getFileName()).isEqualTo("test.pdf");
    }

    @Test
    @DisplayName("포트폴리오 삭제 성공")
    void deletePortfolio_Success() {
        Member member = createMockMember();
        Portfolio portfolio = Portfolio.builder()
                .url("test-url")
                .fileName("test.pdf")
                .build();

        Profile profile = Profile.builder()
                .member(member)
                .nickname("테스트닉네임")
                .profileColor("000000")
                .portfolio(portfolio)
                .build();

        given(profileRepository.findByMemberId(1L)).willReturn(Optional.of(profile));

        profileService.deletePortfolio();

        verify(s3Service).deleteFile("test-url");
        assertThat(profile.getPortfolio()).isNull();
    }

    @Test
    @DisplayName("프로필이 없을 경우 예외 발생")
    void getProfile_NotFound() {
        given(profileRepository.findByMemberId(1L)).willReturn(Optional.empty());

        assertThrows(ProfileNotFoundException.class, () -> profileService.getMyProfile());
    }

    private Member createMockMember() {
        return Member.localBuilder()
                .email("test@test.com")
                .name("테스트")
                .password("password")
                .build();
    }
}