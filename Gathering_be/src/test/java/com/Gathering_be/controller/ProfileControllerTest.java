package com.Gathering_be.controller;

import com.Gathering_be.domain.Portfolio;
import com.Gathering_be.dto.request.ProfileUpdateRequest;
import com.Gathering_be.dto.response.ProfileResponse;
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
        Portfolio portfolio = Portfolio.builder()
                .url("test-url")
                .fileName("test.pdf")
                .build();

        ProfileResponse response = ProfileResponse.builder()
                .profileColor("000000")
                .nickname("테스트닉네임")
                .introduction("테스트 소개")
                .portfolio(portfolio)
                .isPublic(true)
                .build();

        given(profileService.getMyProfile()).willReturn(response);

        mockMvc.perform(get(BASE_URL)
                        .with(SecurityMockMvcRequestPostProcessors.user(TEST_MEMBER_ID.toString())))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResultCode.PROFILE_READ_SUCCESS.getCode()))
                .andExpect(jsonPath("$.data.portfolio.url").value(portfolio.getUrl()))
                .andExpect(jsonPath("$.data.portfolio.fileName").value(portfolio.getFileName()));
    }


    @Test
    @DisplayName("프로필 수정 성공")
    void updateProfile_Success() throws Exception {
        ProfileUpdateRequest request = ProfileUpdateRequest.builder()
                .nickname("새닉네임")
                .introduction("새소개")
                .build();

        mockMvc.perform(put(BASE_URL)
                        .with(SecurityMockMvcRequestPostProcessors.user(TEST_MEMBER_ID.toString()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResultCode.PROFILE_UPDATE_SUCCESS.getCode()));
    }

    @Test
    @DisplayName("포트폴리오 업로드 성공")
    void uploadPortfolio_Success() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.pdf", "application/pdf", "test".getBytes());

        mockMvc.perform(multipart(HttpMethod.POST, BASE_URL + "/portfolio")
                        .file(file)
                        .with(SecurityMockMvcRequestPostProcessors.user(TEST_MEMBER_ID.toString())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResultCode.PORTFOLIO_UPDATE_SUCCESS.getCode()));
    }

    @Test
    @DisplayName("프로필 공개 여부 토글 성공")
    void toggleProfileVisibility_Success() throws Exception {
        mockMvc.perform(put(BASE_URL + "/visibility")
                        .with(SecurityMockMvcRequestPostProcessors.user(TEST_MEMBER_ID.toString())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(ResultCode.PROFILE_VISIBILITY_UPDATE_SUCCESS.getCode()));
    }
}