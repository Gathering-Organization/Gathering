package com.Gathering_be.controller;

import com.Gathering_be.dto.request.ProjectCreateRequest;
import com.Gathering_be.dto.request.ProjectUpdateRequest;
import com.Gathering_be.dto.response.ProjectDetailResponse;
import com.Gathering_be.dto.response.ProjectSimpleResponse;
import com.Gathering_be.global.enums.*;
import com.Gathering_be.global.response.ResultCode;
import com.Gathering_be.service.ProjectService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ProjectControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private WebApplicationContext context;

    @MockBean private ProjectService projectService;

    private ProjectCreateRequest createRequest;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();

        createRequest = ProjectCreateRequest.builder()
                .title("Test Project")
                .description("This is a test project")
                .kakaoUrl("https://open.kakao.com/test")
                .projectType(ProjectType.PROJECT)
                .projectMode(ProjectMode.ONLINE)
                .totalMembers(5)
                .duration("6 months")
                .startDate(LocalDate.of(2025, 1, 1))
                .deadline(LocalDateTime.of(2025, 12, 31, 23, 59))
                .techStacks(Set.of(TechStack.JAVA, TechStack.SPRING, TechStack.REACT))
                .requiredPositions(List.of(JobPosition.BACKEND, JobPosition.FRONTEND))
                .build();
    }

    @Test
    @WithMockUser
    @DisplayName("프로젝트 생성 성공")
    void createProject() throws Exception {
        ProjectDetailResponse projectDetailResponse = ProjectDetailResponse.builder()
                .title(createRequest.getTitle())
                .description(createRequest.getDescription())
                .kakaoUrl(createRequest.getKakaoUrl())
                .projectType(createRequest.getProjectType())
                .projectMode(createRequest.getProjectMode())
                .totalMembers(createRequest.getTotalMembers())
                .duration(createRequest.getDuration())
                .startDate(createRequest.getStartDate())
                .deadline(createRequest.getDeadline())
                .techStacks(createRequest.getTechStacks())
                .requiredPositions(createRequest.getRequiredPositions())
                .build();

        given(projectService.createProject(any(ProjectCreateRequest.class))).willReturn(projectDetailResponse);

        mockMvc.perform(post("/api/project")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value(createRequest.getTitle()));
    }

    @Test
    @WithMockUser
    @DisplayName("단일 프로젝트 조회 성공")
    void getProjectById() throws Exception {
        Long projectId = 1L;
        ProjectDetailResponse response = ProjectDetailResponse.builder()
                .title("Sample Project")
                .build();

        given(projectService.getProjectDetailsById(projectId)).willReturn(response);

        mockMvc.perform(get("/api/project/{id}", projectId))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Sample Project"));
    }

//    @Test
//    @DisplayName("닉네임으로 프로젝트 목록 조회 성공")
//    void getProjectsByNickname_Success() throws Exception {
//        String nickname = "최보근";
//        List<ProjectSimpleResponse> responses = List.of(
//                ProjectSimpleResponse.builder().title("Project 1").build(),
//                ProjectSimpleResponse.builder().title("Project 2").build()
//        );
//
//        given(projectService.getProjectsByNickname(nickname)).willReturn(responses);
//
//                mockMvc.perform(get("/api/project/nickname/{nickname}", nickname)
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.code").value(ResultCode.PROJECT_READ_SUCCESS.getCode()))
//                .andExpect(jsonPath("$.message").value(ResultCode.PROJECT_READ_SUCCESS.getMessage()))
//                .andExpect(jsonPath("$.data").isArray());
//    }

    @Test
    @WithMockUser
    @DisplayName("프로젝트 수정 성공")
    void updateProject() throws Exception {
        Long projectId = 1L;
        ProjectUpdateRequest updateRequest = ProjectUpdateRequest.builder()
                .title("Updated Title")
                .build();

        willDoNothing().given(projectService).updateProject(projectId, updateRequest);

        mockMvc.perform(put("/api/project/{id}", projectId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    @DisplayName("프로젝트 삭제 성공")
    void deleteProject() throws Exception {
        Long projectId = 1L;

        doNothing().when(projectService).deleteProject(projectId);

        mockMvc.perform(delete("/api/project/{id}", projectId))
                .andExpect(status().isOk());

        verify(projectService).deleteProject(projectId);
    }

//    @Test
//    @WithMockUser
//    @DisplayName("모든 프로젝트 조회 성공")
//    void getAllProjects() throws Exception {
//        List<ProjectSimpleResponse> responses = List.of(
//                ProjectSimpleResponse.builder().title("Project 1").build(),
//                ProjectSimpleResponse.builder().title("Project 2").build()
//        );
//
//        given(projectService.getAllProjects(1, 20)).willReturn(responses);
//
//        mockMvc.perform(get("/api/project")
//                        .param("page", "1")
//                        .param("size", "20"))
//                .andDo(print())
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data[0].title").value("Project 1"))
//                .andExpect(jsonPath("$.data[1].title").value("Project 2"));
//    }

//    @Test
//    @WithMockUser
//    @DisplayName("프로젝트 검색 성공")
//    void searchProjects() throws Exception {
//        List<ProjectSimpleResponse> responses = List.of(
//                ProjectSimpleResponse.builder().title("Search Result 1").build(),
//                ProjectSimpleResponse.builder().title("Search Result 2").build()
//        );
//
//        given(projectService.searchProjects(SearchType.TITLE, "Search")).willReturn(responses);
//
//        mockMvc.perform(get("/api/project/search")
//                        .param("searchType", "TITLE")
//                        .param("keyword", "Search"))
//                .andDo(print())
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data[0].title").value("Search Result 1"))
//                .andExpect(jsonPath("$.data[1].title").value("Search Result 2"));
//    }
}
