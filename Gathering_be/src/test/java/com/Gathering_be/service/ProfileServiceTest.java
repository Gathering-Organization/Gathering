package com.Gathering_be.service;

import com.Gathering_be.domain.Member;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.domain.WorkExperience;
import com.Gathering_be.dto.request.ProfileCreateRequest;
import com.Gathering_be.dto.request.ProfileUpdateRequest;
import com.Gathering_be.dto.request.WorkExperienceRequest;
import com.Gathering_be.dto.response.ProfileResponse;
import com.Gathering_be.exception.MemberNotFoundException;
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

import java.time.LocalDate;
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
    @DisplayName("프로필 수정 성공")
    void updateProfile_Success() {
        Member member = createMockMember();
        Profile profile = createMockProfile(member);
        ProfileUpdateRequest request = createMockProfileUpdateRequest();
        MockMultipartFile profileImage = new MockMultipartFile(
                "profileImage", "test.jpg", "image/jpeg", "test".getBytes());

        given(profileRepository.findByMemberId(1L)).willReturn(Optional.of(profile));
        given(s3Service.uploadFile(anyString(), any(MultipartFile.class)))
                .willReturn("https://test-bucket.s3.amazonaws.com/test.jpg");

        profileService.updateProfile(request, profileImage);

        verify(profileRepository).findByMemberId(1L);
        verify(s3Service).uploadFile(anyString(), any(MultipartFile.class));
    }

    @Test
    @DisplayName("프로필 조회 성공")
    void getMyProfile_Success() {
        Member member = createMockMember();
        Profile profile = createMockProfile(member);

        given(profileRepository.findByMemberId(1L)).willReturn(Optional.of(profile));

        ProfileResponse response = profileService.getMyProfile();

        assertThat(response).isNotNull();
        assertThat(response.getJobPosition()).isEqualTo(profile.getJobPosition());
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
        return Profile.builder()
                .member(member)
                .jobPosition(JobPosition.BACKEND)
                .organization("테스트 회사")
                .introduction("테스트 소개")
                .techStacks(new HashSet<>(Arrays.asList("Java", "Spring")))
                .profileColor("000000")
                .profileImageUrl("https://test-bucket.s3.amazonaws.com/test.jpg")
                .portfolioUrl("test-portfolio-url")
                .workExperiences(createMockWorkExperiences())
                .build();
    }

    private List<WorkExperience> createMockWorkExperiences() {
        return Arrays.asList(
                WorkExperience.builder()
                        .startDate(LocalDate.of(2022, 1, 1))
                        .endDate(LocalDate.of(2023, 1, 1))
                        .activityName("테스트 활동")
                        .jobDetail("테스트 직무")
                        .description("테스트 설명")
                        .build()
        );
    }

    private ProfileCreateRequest createMockProfileCreateRequest() {
        return ProfileCreateRequest.builder()
                .jobPosition(JobPosition.BACKEND)
                .organization("테스트 회사")
                .introduction("테스트 소개")
                .techStacks(Arrays.asList("Java", "Spring"))
                .profileColor("000000")
                .portfolioUrl("test-portfolio-url")
                .workExperiences(createMockWorkExperienceRequests())
                .build();
    }

    private ProfileUpdateRequest createMockProfileUpdateRequest() {
        return ProfileUpdateRequest.builder()
                .jobPosition(JobPosition.BACKEND)
                .organization("테스트 회사")
                .introduction("테스트 소개")
                .techStacks(Arrays.asList("Java", "Spring"))
                .profileColor("000000")
                .portfolioUrl("test-portfolio-url")
                .workExperiences(createMockWorkExperienceRequests())
                .build();
    }

    private List<WorkExperienceRequest> createMockWorkExperienceRequests() {
        return Arrays.asList(
                WorkExperienceRequest.builder()
                        .startDate(LocalDate.of(2022, 1, 1))
                        .endDate(LocalDate.of(2023, 1, 1))
                        .activityName("테스트 활동")
                        .jobDetail("테스트 직무")
                        .description("테스트 설명")
                        .build()
        );
    }
}