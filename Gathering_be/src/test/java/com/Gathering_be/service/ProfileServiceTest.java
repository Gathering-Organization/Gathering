package com.Gathering_be.service;

import com.Gathering_be.domain.Member;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.dto.request.ProfileCreateRequest;
import com.Gathering_be.dto.response.ProfileResponse;
import com.Gathering_be.exception.MemberNotFoundException;
import com.Gathering_be.global.enums.Career;
import com.Gathering_be.global.enums.JobPosition;
import com.Gathering_be.global.service.S3Service;
import com.Gathering_be.repository.MemberRepository;
import com.Gathering_be.repository.ProfileRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
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

    private static final Long TEST_MEMBER_ID = 1L;

    @Test
    @DisplayName("프로필 조회 성공")
    void getProfile_Success() {
        // given
        Member member = createMockMember();
        Profile profile = createMockProfile(member);

        given(memberRepository.findById(TEST_MEMBER_ID)).willReturn(Optional.of(member));
        given(profileRepository.findByMemberId(TEST_MEMBER_ID)).willReturn(Optional.of(profile));

        // when
        ProfileResponse response = profileService.getProfile(TEST_MEMBER_ID);

        // then
        assertThat(response.getName()).isEqualTo(member.getName());
        assertThat(response.getEmail()).isEqualTo(member.getEmail());
        assertThat(response.getJobPosition()).isEqualTo(profile.getJobPosition());
        verify(memberRepository).findById(TEST_MEMBER_ID);
        verify(profileRepository).findByMemberId(TEST_MEMBER_ID);
    }

    @Test
    @DisplayName("존재하지 않는 회원의 프로필 조회 시 예외 발생")
    void getProfile_MemberNotFound() {
        // given
        given(memberRepository.findById(TEST_MEMBER_ID)).willReturn(Optional.empty());

        // when & then
        assertThrows(MemberNotFoundException.class,
                () -> profileService.getProfile(TEST_MEMBER_ID));
        verify(memberRepository).findById(TEST_MEMBER_ID);
    }

    @Test
    @DisplayName("프로필 생성 성공")
    void createProfile_Success() {
        // given
        Member member = createMockMember();
        ProfileCreateRequest request = createMockProfileCreateRequest();
        Profile profile = createMockProfile(member);
        MockMultipartFile profileImage = new MockMultipartFile(
                "profileImage", "test.jpg", "image/jpeg", "test".getBytes());

        given(memberRepository.findById(TEST_MEMBER_ID)).willReturn(Optional.of(member));
        given(s3Service.uploadFile(anyString(), any(MultipartFile.class)))
                .willReturn("https://test-bucket.s3.amazonaws.com/test.jpg");
        given(profileRepository.save(any(Profile.class))).willReturn(profile);

        // when
        ProfileResponse response = profileService.createProfile(TEST_MEMBER_ID, request,
                profileImage, null);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getJobPosition()).isEqualTo(request.getJobPosition());
        verify(memberRepository).findById(TEST_MEMBER_ID);
        verify(s3Service).uploadFile(anyString(), any(MultipartFile.class));
        verify(profileRepository).save(any(Profile.class));
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
                .career(Career.THREE_YEARS)
                .introduction("테스트 소개")
                .techStacks(new HashSet<>(Arrays.asList("Java", "Spring")))
                .githubUrl("https://github.com/test")
                .notionUrl("https://notion.site/test")
                .profileImageUrl("https://test-bucket.s3.amazonaws.com/test.jpg")
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
}