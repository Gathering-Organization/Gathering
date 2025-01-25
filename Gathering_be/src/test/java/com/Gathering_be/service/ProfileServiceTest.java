package com.Gathering_be.service;

import com.Gathering_be.domain.Member;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.dto.request.ProfileCreateRequest;
import com.Gathering_be.dto.request.ProfileUpdateRequest;
import com.Gathering_be.dto.response.ProfileResponse;
import com.Gathering_be.exception.MemberNotFoundException;
import com.Gathering_be.global.enums.Career;
import com.Gathering_be.global.enums.JobPosition;
import com.Gathering_be.global.service.S3Service;
import com.Gathering_be.repository.MemberRepository;
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

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {
    @InjectMocks
    private ProfileService profileService;

    @Mock
    private MemberRepository memberRepository;
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
    @DisplayName("프로필 생성 성공")
    void createProfile_Success() {
        Member member = createMockMember();
        ProfileCreateRequest request = createMockProfileCreateRequest();
        Profile profile = createMockProfile(member);

        // Test files
        MockMultipartFile profileImage = new MockMultipartFile(
                "profileImage", "test.jpg", "image/jpeg", "test".getBytes());
        List<MultipartFile> portfolioFiles = Arrays.asList(
                new MockMultipartFile("portfolio", "test1.pdf", "application/pdf", "test1".getBytes()),
                new MockMultipartFile("portfolio", "test2.pdf", "application/pdf", "test2".getBytes())
        );

        given(memberRepository.findById(1L)).willReturn(Optional.of(member));
        given(s3Service.uploadFile(anyString(), any(MultipartFile.class)))
                .willReturn("https://test-bucket.s3.amazonaws.com/test.jpg");
        given(profileRepository.save(any(Profile.class))).willReturn(profile);
        ProfileResponse response = profileService.createProfile(request, profileImage, portfolioFiles);
        assertThat(response).isNotNull();
        assertThat(response.getJobPosition()).isEqualTo(request.getJobPosition());
        verify(profileRepository).save(any(Profile.class));
    }

    @Test
    @DisplayName("프로필 비공개 설정 변경 성공")
    void toggleProfileVisibility_Success() {
        Member member = createMockMember();
        Profile profile = createMockProfile(member);

        given(memberRepository.findById(1L)).willReturn(Optional.of(member));
        given(profileRepository.findByMemberId(1L)).willReturn(Optional.of(profile));

        profileService.toggleProfileVisibility();
        verify(profileRepository).findByMemberId(1L);
    }

    @Test
    @DisplayName("내 프로필 조회 성공")
    void getMyProfile_Success() {
        Member member = createMockMember();
        Profile profile = createMockProfile(member);

        given(memberRepository.findById(1L)).willReturn(Optional.of(member));
        given(profileRepository.findByMemberId(1L)).willReturn(Optional.of(profile));

        ProfileResponse response = profileService.getMyProfile();
        assertThat(response).isNotNull();
        assertThat(response.getEmail()).isEqualTo(member.getEmail());
    }

    @Test
    @DisplayName("프로필 수정 성공")
    void updateProfile_Success() {
        Member member = createMockMember();
        Profile profile = createMockProfile(member);
        ProfileUpdateRequest request = createMockProfileUpdateRequest();

        MockMultipartFile profileImage = new MockMultipartFile(
                "profileImage", "test.jpg", "image/jpeg", "test".getBytes());
        List<MultipartFile> portfolioFiles = Arrays.asList(
                new MockMultipartFile("portfolio", "test1.pdf", "application/pdf", "test1".getBytes())
        );

        given(memberRepository.findById(1L)).willReturn(Optional.of(member));
        given(profileRepository.findByMemberId(1L)).willReturn(Optional.of(profile));
        given(s3Service.uploadFile(anyString(), any(MultipartFile.class)))
                .willReturn("https://test-bucket.s3.amazonaws.com/test.jpg");

        profileService.updateProfile(request, profileImage, portfolioFiles);
        verify(profileRepository).findByMemberId(1L);
    }

    private Member createMockMember() {
        return Member.localBuilder()
                .email("test@test.com")
                .name("테스트")
                .nickname("테스트닉네임")
                .password("password")
                .build();
    }

    private Profile createMockProfile(Member member) {
        List<String> portfolioUrls = Arrays.asList(
                "https://test-bucket.s3.amazonaws.com/test1.pdf",
                "https://test-bucket.s3.amazonaws.com/test2.pdf"
        );

        return Profile.builder()
                .member(member)
                .jobPosition(JobPosition.BACKEND)
                .organization("테스트 회사")
                .career(Career.THREE_YEARS)
                .introduction("테스트 소개")
                .techStacks(new HashSet<>(Arrays.asList("Java", "Spring")))
                .githubUrl("https://github.com/test")
                .notionUrl("https://notion.site/test")
                .profileImageUrl("https://test-bucket.s3.amazonaws.com/test.jpg")
                .portfolioUrls(portfolioUrls)
                .build();
    }

    private ProfileCreateRequest createMockProfileCreateRequest() {
        return ProfileCreateRequest.builder()
                .jobPosition(JobPosition.BACKEND)
                .organization("테스트 회사")
                .career(Career.THREE_YEARS)
                .introduction("테스트 소개")
                .techStacks(Arrays.asList("Java", "Spring"))
                .githubUrl("https://github.com/test")
                .notionUrl("https://notion.site/test")
                .build();
    }

    private ProfileUpdateRequest createMockProfileUpdateRequest() {
        return ProfileUpdateRequest.builder()
                .jobPosition(JobPosition.BACKEND)
                .organization("테스트 회사")
                .career(Career.THREE_YEARS)
                .introduction("테스트 소개")
                .techStacks(Arrays.asList("Java", "Spring"))
                .githubUrl("https://github.com/test")
                .notionUrl("https://notion.site/test")
                .build();
    }
}