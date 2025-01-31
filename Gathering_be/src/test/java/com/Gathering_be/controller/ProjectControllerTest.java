package com.Gathering_be.controller;

import com.Gathering_be.domain.Member;
import com.Gathering_be.domain.Portfolio;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.domain.Project;
import com.Gathering_be.dto.request.ProjectCreateRequest;
import com.Gathering_be.dto.request.ProjectUpdateRequest;
import com.Gathering_be.dto.response.ProjectDetailResponse;
import com.Gathering_be.dto.response.ProjectSimpleResponse;
import com.Gathering_be.exception.ProjectNotFoundException;
import com.Gathering_be.global.enums.ProjectMode;
import com.Gathering_be.global.enums.ProjectType;
import com.Gathering_be.global.response.ResultCode;
import com.Gathering_be.repository.ProjectRepository;
import com.Gathering_be.service.ProfileService;
import com.Gathering_be.service.ProjectService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest
@AutoConfigureMockMvc
class ProjectControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private WebApplicationContext context;
    @Autowired
    private ProjectRepository projectRepository;

    @MockBean
    private ProfileService profileService;
    @MockBean
    private ProjectService projectService;

    private ProjectCreateRequest createRequest;

    @BeforeEach
    void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(context)
                        .build();
        projectRepository.deleteAll();

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
                .techStacks(Set.of("Java", "Spring Boot", "React"))
                .requiredPositions(List.of("Backend", "Frontend"))
                .build();
    }

    @Test
    @WithMockUser(username = "testUser", roles = "USER")
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
                .andExpect(jsonPath("$.data.title").value(createRequest.getTitle()))
                .andExpect(jsonPath("$.data.description").value(createRequest.getDescription()))
                .andExpect(jsonPath("$.data.kakaoUrl").value(createRequest.getKakaoUrl()))
                .andExpect(jsonPath("$.data.projectType").value(createRequest.getProjectType().toString()))
                .andExpect(jsonPath("$.data.projectMode").value(createRequest.getProjectMode().toString()))
                .andExpect(jsonPath("$.data.totalMembers").value(createRequest.getTotalMembers()))
                .andExpect(jsonPath("$.data.duration").value(createRequest.getDuration()))
                .andExpect(jsonPath("$.data.startDate").value(createRequest.getStartDate().toString()))
                .andExpect(jsonPath("$.data.deadline").value(createRequest.getDeadline().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"))))
                .andExpect(jsonPath("$.data.techStacks").isArray())
                .andExpect(jsonPath("$.data.techStacks").value(hasItem("Java")))
                .andExpect(jsonPath("$.data.requiredPositions").isArray())
                .andExpect(jsonPath("$.data.requiredPositions").value(hasItem("Backend")));
    }

    @Test
    @WithMockUser(username = "testUser", roles = "USER")
    void getProjectById() throws Exception {
        Long projectId = 1L;
        ProjectDetailResponse projectDetailResponse = ProjectDetailResponse.builder()
                .title("Sample Project")
                .description("Description of the project")
                .kakaoUrl("https://kakao.com")
                .projectType(ProjectType.PROJECT)
                .projectMode(ProjectMode.ONLINE)
                .totalMembers(5)
                .duration("3 months")
                .startDate(LocalDate.of(2025, 1, 1))
                .deadline(LocalDateTime.of(2025, 12, 31, 23, 59))
                .techStacks(Set.of("Java", "Spring"))
                .requiredPositions(List.of("Backend"))
                .build();

        given(projectService.getProjectById(projectId)).willReturn(projectDetailResponse);

        mockMvc.perform(get("/api/project/{id}", projectId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Sample Project"))
                .andExpect(jsonPath("$.data.description").value("Description of the project"))
                .andExpect(jsonPath("$.data.kakaoUrl").value("https://kakao.com"))
                .andExpect(jsonPath("$.data.projectType").value("PROJECT"))
                .andExpect(jsonPath("$.data.projectMode").value("ONLINE"))
                .andExpect(jsonPath("$.data.totalMembers").value(5))
                .andExpect(jsonPath("$.data.duration").value("3 months"))
                .andExpect(jsonPath("$.data.startDate").value("2025-01-01"))
                .andExpect(jsonPath("$.data.deadline").value("2025-12-31T23:59:00"))
                .andExpect(jsonPath("$.data.techStacks").isArray())
                .andExpect(jsonPath("$.data.techStacks").value(hasItem("Java")))
                .andExpect(jsonPath("$.data.requiredPositions").isArray())
                .andExpect(jsonPath("$.data.requiredPositions").value(hasItem("Backend")));
    }

    @Test
    @WithMockUser(username = "testUser", roles = "USER")
    void updateProject() throws Exception {
        Long projectId = 1L;
        ProjectUpdateRequest updateRequest = ProjectUpdateRequest.builder()
                .title("Updated Title")
                .description("Updated Description")
                .kakaoUrl("https://kakao.com")
                .projectType(ProjectType.PROJECT)
                .projectMode(ProjectMode.OFFLINE)
                .totalMembers(6)
                .duration("4 months")
                .startDate(LocalDate.of(2025, 5, 1))
                .deadline(LocalDateTime.of(2025, 12, 31, 23, 59))
                .techStacks(Set.of("Java", "Python"))
                .requiredPositions(List.of("Frontend"))
                .build();

        willDoNothing().given(projectService).updateProject(eq(projectId), any(ProjectUpdateRequest.class));

        mockMvc.perform(put("/api/project/{id}", projectId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "testUser", roles = "USER")
    void deleteProject() throws Exception {
        Long projectId = 1L;

        doNothing().when(projectService).deleteProject(projectId);

        mockMvc.perform(delete("/api/project/{id}", projectId))
                .andExpect(status().isOk());

        verify(projectService).deleteProject(projectId);
    }

    @Test
    @WithMockUser(username = "testUser", roles = "USER")
    void getAllProjects() throws Exception {
        ProjectSimpleResponse project1 = ProjectSimpleResponse.builder()
                .title("Test Project 1")
                .build();
        ProjectSimpleResponse project2 = ProjectSimpleResponse.builder()
                .title("Test Project 2")
                .build();

        List<ProjectSimpleResponse> projects = List.of(project1, project2);

        given(projectService.getAllProjects()).willReturn(projects);

        mockMvc.perform(get("/api/project"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].title").value("Test Project 1"))
                .andExpect(jsonPath("$.data[1].title").value("Test Project 2"));
    }
}