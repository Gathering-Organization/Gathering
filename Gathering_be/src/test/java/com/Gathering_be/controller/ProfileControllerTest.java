package com.Gathering_be.controller;

import com.Gathering_be.dto.request.ProfileCreateRequest;
import com.Gathering_be.dto.request.WorkExperienceRequest;
import com.Gathering_be.dto.response.ProfileResponse;
import com.Gathering_be.dto.response.WorkExperienceResponse;
import com.Gathering_be.global.enums.Career;
import com.Gathering_be.global.enums.JobPosition;
import com.Gathering_be.global.response.ResultCode;
import com.Gathering_be.service.ProfileService;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
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
    @DisplayName("내 프로필 조회 성공")
    void getMyProfile_Success() throws Exception {
        ProfileResponse response = createMockProfileResponse();
        given(profileService.getMyProfile()).willReturn(response);

        mockMvc.perform(get(BASE_URL)
                        .with(SecurityMockMvcRequestPostProcessors.user(TEST_MEMBER_ID.toString())))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResultCode.PROFILE_READ_SUCCESS.getCode()));
    }

    private ProfileResponse createMockProfileResponse() {
        return ProfileResponse.builder()
                .email("test@test.com")
                .name("테스트")
                .nickname("테스트닉네임")
                .jobPosition(JobPosition.BACKEND)
                .organization("테스트 회사")
                .introduction("테스트 소개")
                .techStacks(new HashSet<>(Arrays.asList("Java", "Spring")))
                .profileImageUrl("https://test-bucket.s3.amazonaws.com/test.jpg")
                .profileColor("000000")
                .portfolioUrl("test-portfolio-url")
                .workExperiences(createMockWorkExperienceResponses())
                .isPublic(true)
                .build();
    }

    private List<WorkExperienceResponse> createMockWorkExperienceResponses() {
        return Arrays.asList(
                WorkExperienceResponse.builder()
                        .startDate(LocalDate.of(2022, 1, 1))
                        .endDate(LocalDate.of(2023, 1, 1))
                        .activityName("테스트 활동")
                        .jobDetail("테스트 직무")
                        .description("테스트 설명")
                        .build()
        );
    }
}