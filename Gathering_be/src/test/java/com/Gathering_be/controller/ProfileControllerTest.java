package com.Gathering_be.controller;

import com.Gathering_be.dto.request.ProfileCreateRequest;
import com.Gathering_be.dto.response.ProfileResponse;
import com.Gathering_be.global.enums.Career;
import com.Gathering_be.global.enums.JobPosition;
import com.Gathering_be.global.response.ResultCode;
import com.Gathering_be.service.ProfileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.HashSet;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProfileService profileService;

    private static final String BASE_URL = "/api/profile";
    private static final Long TEST_MEMBER_ID = 1L;

    @Test
    @DisplayName("프로필 조회 성공")
    void getProfile_Success() throws Exception {
        // given
        ProfileResponse response = createMockProfileResponse();
        given(profileService.getProfile(TEST_MEMBER_ID)).willReturn(response);

        // when & then
        mockMvc.perform(get(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(SecurityMockMvcRequestPostProcessors.user(TEST_MEMBER_ID.toString())))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResultCode.PROFILE_READ_SUCCESS.getCode()))
                .andExpect(jsonPath("$.data.name").value(response.getName()));
    }

    @Test
    @DisplayName("프로필 생성 성공")
    void createProfile_Success() throws Exception {
        // given
        ProfileCreateRequest request = createMockProfileCreateRequest();
        ProfileResponse response = createMockProfileResponse();

        MockMultipartFile profileImage = new MockMultipartFile(
                "profileImage",
                "test.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test image content".getBytes()
        );

        MockMultipartFile requestFile = new MockMultipartFile(
                "request",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsString(request).getBytes()
        );

        given(profileService.createProfile(eq(TEST_MEMBER_ID), any(ProfileCreateRequest.class),
                any(MultipartFile.class), any(MultipartFile.class))).willReturn(response);

        // when & then
        mockMvc.perform(multipart(BASE_URL)
                        .file(profileImage)
                        .file(requestFile)
                        .with(SecurityMockMvcRequestPostProcessors.user(TEST_MEMBER_ID.toString())))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResultCode.PROFILE_CREATE_SUCCESS.getCode()));
    }

    @Test
    @DisplayName("프로필 수정 성공")
    void updateProfile_Success() throws Exception {
        // given
        ProfileCreateRequest request = createMockProfileCreateRequest();

        MockMultipartFile profileImage = new MockMultipartFile(
                "profileImage",
                "test.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test image content".getBytes()
        );

        MockMultipartFile requestFile = new MockMultipartFile(
                "request",
                "",
                MediaType.APPLICATION_JSON_VALUE,
                objectMapper.writeValueAsString(request).getBytes()
        );

        // when & then
        mockMvc.perform(multipart(HttpMethod.PUT, BASE_URL)
                        .file(profileImage)
                        .file(requestFile)
                        .with(SecurityMockMvcRequestPostProcessors.user(TEST_MEMBER_ID.toString())))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResultCode.PROFILE_UPDATE_SUCCESS.getCode()));
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

    private ProfileResponse createMockProfileResponse() {
        return ProfileResponse.builder()
                .email("test@test.com")
                .name("테스트")
                .nickname("테스트닉네임")
                .jobPosition(JobPosition.BACKEND)
                .organization("테스트 회사")
                .career(Career.THREE_YEARS)
                .introduction("테스트 소개")
                .techStacks(new HashSet<>(Arrays.asList("Java", "Spring")))
                .githubUrl("https://github.com/test")
                .notionUrl("https://notion.site/test")
                .profileImageUrl("https://test-bucket.s3.amazonaws.com/test.jpg")
                .portfolioUrl("https://test-bucket.s3.amazonaws.com/test.pdf")
                .build();
    }
}