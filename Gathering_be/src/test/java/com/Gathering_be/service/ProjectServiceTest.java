package com.Gathering_be.service;

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
import com.Gathering_be.repository.MemberRepository;
import com.Gathering_be.repository.ProfileRepository;
import com.Gathering_be.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

class ProjectServiceTest {
    @InjectMocks
    private ProjectService projectService;

    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private ProfileRepository profileRepository;
    @Mock
    private MemberRepository memberRepository;

    private Profile owner;
    private Profile teamMember;
    private Project project;
    private ProjectCreateRequest createRequest;
    private ProjectUpdateRequest updateRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);
        SecurityContextHolder.setContext(securityContext);
        given(securityContext.getAuthentication()).willReturn(authentication);
        given(authentication.getName()).willReturn("1");

        owner = createMockProfile("owner@test.com", "프로젝트생성자", "owner_nickname", 1L);
        teamMember = createMockProfile("team@test.com", "팀원", "team_nickname", 2L);

        Set<Profile> teams = Set.of(teamMember);
        project = Project.builder()
                .profile(owner)
                .title("Test Project")
                .description("This is a test project")
                .kakaoUrl("https://open.kakao.com/test")
                .projectType(ProjectType.PROJECT)
                .projectMode(ProjectMode.ONLINE)
                .totalMembers(5)
                .duration("6 months")
                .deadline(LocalDateTime.of(2025, 12, 31, 23, 59))
                .startDate(LocalDate.of(2025, 1, 1))
                .techStacks(Set.of("Java", "Spring Boot", "React"))
                .teams(teams)
                .requiredPositions(List.of("Backend", "Frontend"))
                .build();

        createRequest = ProjectCreateRequest.builder()
                .title("Test Project")
                .description("This is a test project")
                .kakaoUrl("https://open.kakao.com/test")
                .projectType(ProjectType.PROJECT)
                .projectMode(ProjectMode.ONLINE)
                .totalMembers(5)
                .duration("6 months")
                .deadline(LocalDateTime.of(2025, 12, 31, 23, 59))
                .startDate(LocalDate.of(2025, 1, 1))
                .techStacks(Set.of("Java", "Spring Boot", "React"))
                .teams(Set.of("team_nickname"))
                .requiredPositions(List.of("Backend", "Frontend"))
                .build();

        updateRequest = ProjectUpdateRequest.builder()
                .title("Updated Project")
                .description("Updated description")
                .kakaoUrl("https://open.kakao.com/updated")
                .projectType(ProjectType.STUDY)
                .projectMode(ProjectMode.OFFLINE)
                .totalMembers(10)
                .duration("1 year")
                .deadline(LocalDateTime.of(2026, 12, 31, 23, 59))
                .startDate(LocalDate.of(2026, 1, 1))
                .techStacks(Set.of("Python", "Django"))
                .teams(Set.of())
                .requiredPositions(List.of("Backend", "Data Science"))
                .build();
    }

    @Test
    @DisplayName("프로젝트 생성 성공")
    void createProjectTest() {
        when(profileRepository.findByMemberId(1L)).thenReturn(Optional.of(owner));
        when(profileRepository.findByNickname(any())).thenReturn(Optional.of(teamMember));
        when(projectRepository.save(any())).thenReturn(project);

        ProjectDetailResponse response = projectService.createProject(createRequest);

        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo(createRequest.getTitle());
        assertThat(response.getDescription()).isEqualTo(createRequest.getDescription());
        assertThat(response.getKakaoUrl()).isEqualTo(createRequest.getKakaoUrl());
        assertThat(response.getProjectType()).isEqualTo(createRequest.getProjectType());
        assertThat(response.getProjectMode()).isEqualTo(createRequest.getProjectMode());
        assertThat(response.getTotalMembers()).isEqualTo(createRequest.getTotalMembers());
        assertThat(response.getDuration()).isEqualTo(createRequest.getDuration());
        assertThat(response.getDeadline()).isEqualTo(createRequest.getDeadline());
        assertThat(response.getStartDate()).isEqualTo(createRequest.getStartDate());
        assertThat(response.getTechStacks()).containsExactlyInAnyOrderElementsOf(createRequest.getTechStacks());
        assertThat(response.getTeams()).hasSize(createRequest.getTeams().size());
        assertThat(response.getRequiredPositions()).containsExactlyInAnyOrderElementsOf(createRequest.getRequiredPositions());
        assertThat(response.isClosed()).isFalse();
    }

    @Test
    @DisplayName("단일 프로젝트 조회 성공")
    void getProjectByIdTest() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));

        ProjectDetailResponse response = projectService.getProjectById(1L);

        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("Test Project");
        assertThat(response.getDescription()).isEqualTo("This is a test project");
        assertThat(response.getKakaoUrl()).isEqualTo("https://open.kakao.com/test");
        assertThat(response.getProjectType()).isEqualTo(ProjectType.PROJECT);
        assertThat(response.getProjectMode()).isEqualTo(ProjectMode.ONLINE);
        assertThat(response.getTotalMembers()).isEqualTo(5);
        assertThat(response.getDuration()).isEqualTo("6 months");
        assertThat(response.getDeadline()).isEqualTo(LocalDateTime.of(2025, 12, 31, 23, 59));
        assertThat(response.getStartDate()).isEqualTo(LocalDate.of(2025, 1, 1));
        assertThat(response.getTechStacks()).containsExactlyInAnyOrder("Java", "Spring Boot", "React");
        assertThat(response.getTeams()).hasSize(1);
        assertThat(response.getRequiredPositions()).containsExactlyInAnyOrder("Backend", "Frontend");
        assertThat(response.isClosed()).isFalse();
    }

    @Test
    @DisplayName("모든 프로젝트 조회 성공")
    void getAllProjectsTest() {
        Project newProject = Project.builder().profile(owner).title("Another Project").build();
        List<Project> projectList = List.of(project, newProject);

        when(projectRepository.findAll()).thenReturn(projectList);

        List<ProjectSimpleResponse> response = projectService.getAllProjects();

        assertThat(response).isNotNull();
        assertThat(response).hasSize(2);
        assertThat(response.get(0).getTitle()).isEqualTo("Test Project");
        assertThat(response.get(1).getTitle()).isEqualTo("Another Project");
    }

    @Test
    @DisplayName("프로젝트 수정 성공")
    void updateProjectTest() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));

        projectService.updateProject(1L, updateRequest);

        assertThat(project.getTitle()).isEqualTo(updateRequest.getTitle());
        assertThat(project.getDescription()).isEqualTo(updateRequest.getDescription());
        assertThat(project.getKakaoUrl()).isEqualTo(updateRequest.getKakaoUrl());
        assertThat(project.getProjectType()).isEqualTo(updateRequest.getProjectType());
        assertThat(project.getProjectMode()).isEqualTo(updateRequest.getProjectMode());
        assertThat(project.getTotalMembers()).isEqualTo(updateRequest.getTotalMembers());
        assertThat(project.getDuration()).isEqualTo(updateRequest.getDuration());
        assertThat(project.getDeadline()).isEqualTo(updateRequest.getDeadline());
        assertThat(project.getStartDate()).isEqualTo(updateRequest.getStartDate());
        assertThat(project.getTechStacks()).isEqualTo(updateRequest.getTechStacks());
        assertThat(project.getTeams()).isEqualTo(updateRequest.getTeams());
        assertThat(project.getRequiredPositions()).isEqualTo(updateRequest.getRequiredPositions());
        assertThat(project.isClosed()).isEqualTo(updateRequest.isClosed());
    }

    @Test
    @DisplayName("프로젝트 삭제 성공")
    void deleteProject() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        doNothing().when(projectRepository).deleteById(1L);

        assertThatNoException().isThrownBy(() -> projectService.deleteProject(1L));
        verify(projectRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("프로젝트가 없을 경우 예외 발생")
    void getProject_NotFound() {
        Long projectId = 99L;
        when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.getProjectById(projectId))
                .isInstanceOf(ProjectNotFoundException.class);
    }

    private Profile createMockProfile(String email, String name, String nickname, Long memberId) {
        Member member = mock(Member.class);
        when(member.getEmail()).thenReturn(email);
        when(member.getName()).thenReturn(name);
        when(member.getPassword()).thenReturn("password");
        when(member.getId()).thenReturn(memberId);

        Portfolio portfolio = Portfolio.builder()
                .url("test-url")
                .fileName("test.pdf")
                .build();

        Profile profile = Profile.builder()
                .member(member)
                .nickname(nickname)
                .profileColor("000000")
                .introduction("테스트 소개")
                .portfolio(portfolio)
                .isPublic(true)
                .build();

        return profile;
    }


}

