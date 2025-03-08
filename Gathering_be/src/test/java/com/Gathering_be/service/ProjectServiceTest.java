package com.Gathering_be.service;

import com.Gathering_be.domain.*;
import com.Gathering_be.dto.request.ProjectCreateRequest;
import com.Gathering_be.dto.request.ProjectUpdateRequest;
import com.Gathering_be.dto.response.ProjectDetailResponse;
import com.Gathering_be.dto.response.ProjectSimpleResponse;
import com.Gathering_be.exception.InvalidSearchTypeException;
import com.Gathering_be.exception.ProfileNotFoundException;
import com.Gathering_be.exception.ProjectNotFoundException;
import com.Gathering_be.global.enums.*;
import com.Gathering_be.repository.InterestProjectRepository;
import com.Gathering_be.repository.ProfileRepository;
import com.Gathering_be.repository.ProjectRepository;
import lombok.Getter;
import lombok.Setter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicLong;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {
    private static final AtomicLong PROFILE_ID_SEQUENCE = new AtomicLong(1L);
    private static final AtomicLong PROJECT_ID_SEQUENCE = new AtomicLong(1L);

    @InjectMocks
    private ProjectService projectService;

    @Mock
    private RedisService redisService;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private ProfileRepository profileRepository;
    @Mock
    private InterestProjectRepository interestProjectRepository;

    private TestDataBuilder testData;

    @BeforeEach
    void setUp() {
        setupSecurityContext();
        testData = new TestDataBuilder();
        PROFILE_ID_SEQUENCE.set(1L);
        PROJECT_ID_SEQUENCE.set(1L);
    }

    @Nested
    @DisplayName("프로젝트 생성 테스트")
    class CreateProjectTest {
        @Test
        @DisplayName("정상적인 프로젝트 생성")
        void createProject_Success() {
            // given
            given(profileRepository.findByMemberId(1L)).willReturn(Optional.of(testData.getOwner()));
            given(profileRepository.findAllByNicknameIn(Set.of("team_nickname")))
                    .willReturn(List.of(testData.getTeamMember()));
            given(projectRepository.save(any(Project.class)))
                    .willAnswer(invocation -> {
                        Project project = invocation.getArgument(0);
                        ReflectionTestUtils.setField(project, "id", PROJECT_ID_SEQUENCE.getAndIncrement());
                        return project;
                    });

            // when
            ProjectDetailResponse response = projectService.createProject(testData.getCreateRequest());

            // then
            assertProjectResponse(response, testData.getCreateRequest());
            verify(projectRepository).save(any(Project.class));
        }

        @Test
        @DisplayName("존재하지 않는 팀원으로 프로젝트 생성 시 실패")
        void createProject_WithInvalidTeamMember_ThrowsException() {
            // given
            given(profileRepository.findByMemberId(1L)).willReturn(Optional.of(testData.getOwner()));
            given(profileRepository.findAllByNicknameIn(any())).willReturn(List.of());

            // when & then
            assertThatThrownBy(() -> projectService.createProject(testData.getCreateRequest()))
                    .isInstanceOf(ProfileNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("프로젝트 조회 테스트")
    class GetProjectTest {
        @Test
        @DisplayName("단일 프로젝트 조회 성공")
        void getProjectById_Success() {
            // given
            Long projectId = 1L;
            given(projectRepository.findById(projectId)).willReturn(Optional.of(testData.getProject()));
            given(profileRepository.findByMemberId(1L)).willReturn(Optional.of(testData.getOwner()));

            // when
            ProjectDetailResponse response = projectService.getProjectById(projectId);

            // then
            assertProjectDetails(response);
        }

//        @Test
//        @DisplayName("닉네임으로 프로젝트 목록 조회 성공")
//        void getProjectsByNickname_Success() {
//            // given
//            String nickname = "owner_nickname";
//            given(projectRepository.findAllByProfileNickname(nickname)).willReturn(List.of(testData.getProject()));
//            given(interestProjectRepository.existsByProfileIdAndProjectId(testData.owner.getId(), testData.getProject().getId()))
//                    .willReturn(true);
//            given(profileRepository.findByMemberId(1L)).willReturn(Optional.of(testData.owner));
//
//            // when
//            List<ProjectSimpleResponse> result = projectService.getProjectsByNickname(nickname);
//
//            // then
//            assertThat(result).hasSize(1);
//            assertThat(result.get(0).getTitle()).isEqualTo("Test Project");
//            assertThat(result.get(0).isInterested()).isTrue();
//        }

        @Test
        @DisplayName("존재하지 않는 프로젝트 조회시 예외 발생")
        void getProjectById_NotFound_ThrowsException() {
            // given
            Long projectId = 99L;
            given(projectRepository.findById(projectId)).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> projectService.getProjectById(projectId))
                    .isInstanceOf(ProjectNotFoundException.class);
        }

//        @Test
//        @DisplayName("로그인 상태에서 관심 프로젝트가 있는 경우 전체 프로젝트 조회 성공")
//        void getAllProjects_WithLoginAndInterested_Success() {
//            // given
//            Project anotherProject = Project.builder()
//                    .profile(testData.getOwner())
//                    .title("Another Project")
//                    .description("Another test project")
//                    .projectType(ProjectType.STUDY)
//                    .projectMode(ProjectMode.ONLINE)
//                    .build();
//
//            InterestProject interest = InterestProject.builder()
//                    .id(1L)
//                    .project(testData.getProject())
//                    .profile(testData.getOwner())
//                    .build();
//
//            given(profileRepository.findByMemberId(1L)).willReturn(Optional.of(testData.getOwner()));
//            given(projectRepository.findAll(PageRequest.of(0, 10))).willReturn(new PageImpl<>(List.of(testData.getProject(), anotherProject)));
//            given(interestProjectRepository.findAllByProfileId(testData.getOwner().getId()))
//                    .willReturn(List.of(interest));
//
//            // when
//            List<ProjectSimpleResponse> results = projectService.getAllProjects(1, 10);
//
//            // then
//            assertThat(results).hasSize(2);
//            assertThat(results.get(0).isInterested()).isTrue();
//            assertThat(results.get(1).isInterested()).isFalse();
//        }

//        @Test
//        @DisplayName("로그인 상태에서 관심 프로젝트가 없는 경우 전체 프로젝트 조회 성공")
//        void getAllProjects_WithLoginNoInterest_Success() {
//            // given
//            given(profileRepository.findByMemberId(1L)).willReturn(Optional.of(testData.getOwner()));
//            given(projectRepository.findAll(PageRequest.of(0, 10))).willReturn(new PageImpl<>(List.of(testData.getProject())));
//            given(interestProjectRepository.findAllByProfileId(testData.getOwner().getId()))
//                    .willReturn(List.of());
//
//            // when
//            List<ProjectSimpleResponse> results = projectService.getAllProjects(1, 10);
//
//            // then
//            assertThat(results).hasSize(1);
//            assertThat(results.get(0).isInterested()).isFalse();
//        }

//        @Test
//        @DisplayName("비로그인 상태에서 전체 프로젝트 조회 성공")
//        void getAllProjects_WithoutLogin_Success() {
//            // given
//            SecurityContext securityContext = mock(SecurityContext.class);
//            Authentication authentication = mock(Authentication.class);
//            SecurityContextHolder.setContext(securityContext);
//            given(securityContext.getAuthentication()).willReturn(authentication);
//            given(authentication.getName()).willReturn("anonymousUser");
//
//            given(projectRepository.findAll(PageRequest.of(0, 10))).willReturn(new PageImpl<>(List.of(testData.getProject())));
//
//            // when
//            List<ProjectSimpleResponse> results = projectService.getAllProjects(1, 10);
//
//            // then
//            assertThat(results).hasSize(1);
//            assertThat(results.get(0).isInterested()).isFalse();
//            verify(interestProjectRepository, never()).findAllByProfileId(any());
//        }
    }

    @Nested
    @DisplayName("프로젝트 수정 테스트")
    class UpdateProjectTest {
        @Test
        @DisplayName("프로젝트 수정 성공")
        void updateProject_Success() {
            // given
            Long projectId = 1L;
            given(projectRepository.findById(projectId)).willReturn(Optional.of(testData.getProject()));

            // when
            projectService.updateProject(projectId, testData.getUpdateRequest());

            // then
            Project updatedProject = testData.getProject();
            assertProjectUpdated(updatedProject, testData.getUpdateRequest());
        }

        @Test
        @DisplayName("모집 상태 토글 성공")
        void toggleProjectRecruitment_Success() {
            // given
            Long projectId = 1L;
            Project project = testData.getProject();
            boolean currentStatus = project.isClosed();
            given(projectRepository.findById(projectId)).willReturn(Optional.of(testData.getProject()));

            // when
            projectService.toggleProjectRecruitment(projectId);

            // then
            Project updatedProject = projectRepository.findById(projectId).orElseThrow();
            assertThat(updatedProject.isClosed()).isNotEqualTo(currentStatus);
        }
    }

    @Nested
    @DisplayName("프로젝트 삭제 테스트")
    class DeleteProjectTest {
        @Test
        @DisplayName("프로젝트 삭제 성공")
        void deleteProject_Success() {
            // given
            Long projectId = 1L;
            given(projectRepository.findById(projectId)).willReturn(Optional.of(testData.getProject()));

            // when
            projectService.deleteProject(projectId);

            // then
            verify(projectRepository).deleteById(projectId);
        }
    }

//    @Nested
//    @DisplayName("프로젝트 검색 테스트")
//    class SearchProjectTest {
//        @Test
//        @DisplayName("제목으로 프로젝트 검색 성공")
//        void searchProjects_ByTitle_Success() {
//            // given
//            String keyword = "Test";
//            given(projectRepository.findByTitleContaining(keyword))
//                    .willReturn(List.of(testData.getProject()));
//            given(profileRepository.findByMemberId(1L))
//                    .willReturn(Optional.of(testData.getOwner()));
//
//            // when
//            List<ProjectSimpleResponse> results = projectService.searchProjects(SearchType.TITLE, keyword);
//
//            // then
//            assertThat(results).hasSize(1);
//            assertSearchResult(results.get(0), testData.getProject());
//            verify(projectRepository).findByTitleContaining(keyword);
//        }
//
//        @Test
//        @DisplayName("내용으로 프로젝트 검색 성공")
//        void searchProjects_ByContent_Success() {
//            // given
//            String keyword = "project";
//            given(projectRepository.findByDescriptionContaining(keyword))
//                    .willReturn(List.of(testData.getProject()));
//            given(profileRepository.findByMemberId(1L))
//                    .willReturn(Optional.of(testData.getOwner()));
//
//            // when
//            List<ProjectSimpleResponse> results = projectService.searchProjects(SearchType.CONTENT, keyword);
//
//            // then
//            assertThat(results).hasSize(1);
//            assertSearchResult(results.get(0), testData.getProject());
//            verify(projectRepository).findByDescriptionContaining(keyword);
//        }
//
//        @Test
//        @DisplayName("제목과 내용으로 프로젝트 검색 성공")
//        void searchProjects_ByTitleAndContent_Success() {
//            // given
//            String keyword = "Test";
//            given(projectRepository.findByTitleContainingOrDescriptionContaining(keyword, keyword))
//                    .willReturn(List.of(testData.getProject()));
//            given(profileRepository.findByMemberId(1L))
//                    .willReturn(Optional.of(testData.getOwner()));
//
//            // when
//            List<ProjectSimpleResponse> results = projectService.searchProjects(SearchType.TITLE_CONTENT, keyword);
//
//            // then
//            assertThat(results).hasSize(1);
//            assertSearchResult(results.get(0), testData.getProject());
//            verify(projectRepository).findByTitleContainingOrDescriptionContaining(keyword, keyword);
//        }
//
//        @Test
//        @DisplayName("유효하지 않은 검색 타입으로 검색시 예외 발생")
//        void searchProjects_WithInvalidSearchType_ThrowsException() {
//            // given
//            SearchType invalidType = null;
//            String keyword = "Test";
//
//            // when & then
//            assertThatThrownBy(() -> projectService.searchProjects(invalidType, keyword))
//                    .isInstanceOf(InvalidSearchTypeException.class);
//        }
//
//        @Test
//        @DisplayName("검색 결과가 없을 경우 빈 리스트 반환")
//        void searchProjects_NoResults_ReturnsEmptyList() {
//            // given
//            String keyword = "NonExistent";
//            given(projectRepository.findByTitleContaining(keyword))
//                    .willReturn(List.of());
//
//            // when
//            List<ProjectSimpleResponse> results = projectService.searchProjects(SearchType.TITLE, keyword);
//
//            // then
//            assertThat(results).isEmpty();
//        }
//
//
//    }

    private void setupSecurityContext() {
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);
        SecurityContextHolder.setContext(securityContext);
        lenient().when(securityContext.getAuthentication()).thenReturn(authentication);
        lenient().when(authentication.getName()).thenReturn("1");
    }

    private void assertProjectResponse(ProjectDetailResponse response, ProjectCreateRequest request) {
        assertThat(response)
                .satisfies(r -> {
                    assertThat(r.getTitle()).isEqualTo(request.getTitle());
                    assertThat(r.getDescription()).isEqualTo(request.getDescription());
                    assertThat(r.getKakaoUrl()).isEqualTo(request.getKakaoUrl());
                    assertThat(r.getProjectType()).isEqualTo(request.getProjectType());
                    assertThat(r.getProjectMode()).isEqualTo(request.getProjectMode());
                    assertThat(r.getTotalMembers()).isEqualTo(request.getTotalMembers());
                    assertThat(r.getDuration()).isEqualTo(request.getDuration());
                    assertThat(r.getDeadline()).isEqualTo(request.getDeadline());
                    assertThat(r.getStartDate()).isEqualTo(request.getStartDate());
                    assertThat(r.getTechStacks()).containsExactlyInAnyOrderElementsOf(request.getTechStacks());
                    assertThat(r.getTeams()).hasSize(request.getTeams().size());
                    assertThat(r.getRequiredPositions()).containsExactlyInAnyOrderElementsOf(request.getRequiredPositions());
                    assertThat(r.isClosed()).isFalse();
                });
    }

    private void assertProjectDetails(ProjectDetailResponse response) {
        assertThat(response)
                .satisfies(r -> {
                    assertThat(r.getTitle()).isEqualTo("Test Project");
                    assertThat(r.getDescription()).isEqualTo("This is a test project");
                    assertThat(r.getKakaoUrl()).isEqualTo("https://open.kakao.com/test");
                    assertThat(r.getProjectType()).isEqualTo(ProjectType.PROJECT);
                    assertThat(r.getProjectMode()).isEqualTo(ProjectMode.ONLINE);
                    assertThat(r.getTotalMembers()).isEqualTo(5);
                    assertThat(r.getDuration()).isEqualTo("6 months");
                    assertThat(r.getDeadline()).isEqualTo(LocalDateTime.of(2025, 12, 31, 23, 59));
                    assertThat(r.getStartDate()).isEqualTo(LocalDate.of(2025, 1, 1));
                    assertThat(r.getTechStacks()).containsExactlyInAnyOrder(TechStack.JAVA, TechStack.SPRING, TechStack.REACT);
                    assertThat(r.getTeams()).hasSize(1);
                    assertThat(r.getRequiredPositions()).containsExactlyInAnyOrder(JobPosition.BACKEND, JobPosition.FRONTEND);
                    assertThat(r.isClosed()).isFalse();
                });
    }

    private void assertProjectUpdated(Project project, ProjectUpdateRequest request) {
        assertThat(project)
                .satisfies(p -> {
                    assertThat(p.getTitle()).isEqualTo(request.getTitle());
                    assertThat(p.getDescription()).isEqualTo(request.getDescription());
                    assertThat(p.getKakaoUrl()).isEqualTo(request.getKakaoUrl());
                    assertThat(p.getProjectType()).isEqualTo(request.getProjectType());
                    assertThat(p.getProjectMode()).isEqualTo(request.getProjectMode());
                    assertThat(p.getTotalMembers()).isEqualTo(request.getTotalMembers());
                    assertThat(p.getDuration()).isEqualTo(request.getDuration());
                    assertThat(p.getDeadline()).isEqualTo(request.getDeadline());
                    assertThat(p.getStartDate()).isEqualTo(request.getStartDate());
                    assertThat(p.getTechStacks()).isEqualTo(request.getTechStacks());
                    assertThat(p.getTeams()).isEqualTo(request.getTeams());
                    assertThat(p.getRequiredPositions()).isEqualTo(request.getRequiredPositions());
                });
    }

    private void assertSearchResult(ProjectSimpleResponse response, Project project) {
        assertThat(response)
                .satisfies(r -> {
                    assertThat(r.getTitle()).isEqualTo(project.getTitle());
                    assertThat(r.getProjectType()).isEqualTo(project.getProjectType());
                    assertThat(r.getTechStacks()).containsExactlyInAnyOrderElementsOf(project.getTechStacks());
                    assertThat(r.getRequiredPositions()).containsExactlyInAnyOrderElementsOf(project.getRequiredPositions());
                });
    }

    @Getter
    @Setter
    class TestDataBuilder {
        private final Profile owner;
        private final Profile teamMember;
        private final Project project;
        private final ProjectCreateRequest createRequest;
        private final ProjectUpdateRequest updateRequest;

        public TestDataBuilder() {
            this.owner = createProfile("owner@test.com", "프로젝트생성자", "owner_nickname", 1L);
            ReflectionTestUtils.setField(this.owner, "id", ProjectServiceTest.PROFILE_ID_SEQUENCE.getAndIncrement());

            this.teamMember = createProfile("team@test.com", "팀원", "team_nickname", 2L);
            ReflectionTestUtils.setField(this.teamMember, "id", ProjectServiceTest.PROFILE_ID_SEQUENCE.getAndIncrement());

            this.project = createProject();
            ReflectionTestUtils.setField(this.project, "id", ProjectServiceTest.PROJECT_ID_SEQUENCE.getAndIncrement());

            this.createRequest = createProjectRequest();
            this.updateRequest = updateProjectRequest();
        }

        private Profile createProfile(String email, String name, String nickname, Long memberId) {
            Member member = mock(Member.class);
            lenient().when(member.getId()).thenReturn(memberId);

            Portfolio portfolio = Portfolio.builder()
                    .url("test-url")
                    .fileName("test.pdf")
                    .build();

            return Profile.builder()
                    .member(member)
                    .nickname(nickname)
                    .profileColor("000000")
                    .introduction("테스트 소개")
                    .portfolio(portfolio)
                    .isPublic(true)
                    .build();
        }

        private Project createProject() {
            Project project = Project.builder()
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
                    .techStacks(Set.of(TechStack.JAVA, TechStack.SPRING, TechStack.REACT))
                    .requiredPositions(List.of(JobPosition.BACKEND, JobPosition.FRONTEND))
                    .build();

            Set<ProjectTeams> teams = Set.of(
                    ProjectTeams.builder()
                            .profile(teamMember)
                            .project(project)
                            .build()
            );
            project.getTeams().addAll(teams);

            return project;
        }

        private ProjectCreateRequest createProjectRequest() {
            return ProjectCreateRequest.builder()
                    .title("Test Project")
                    .description("This is a test project")
                    .kakaoUrl("https://open.kakao.com/test")
                    .projectType(ProjectType.PROJECT)
                    .projectMode(ProjectMode.ONLINE)
                    .totalMembers(5)
                    .duration("6 months")
                    .deadline(LocalDateTime.of(2025, 12, 31, 23, 59))
                    .startDate(LocalDate.of(2025, 1, 1))
                    .techStacks(Set.of(TechStack.JAVA, TechStack.SPRING, TechStack.REACT))
                    .teams(Set.of("team_nickname"))
                    .requiredPositions(List.of(JobPosition.BACKEND, JobPosition.FRONTEND))
                    .build();
        }

        private ProjectUpdateRequest updateProjectRequest() {
            return ProjectUpdateRequest.builder()
                    .title("Updated Project")
                    .description("Updated description")
                    .kakaoUrl("https://open.kakao.com/updated")
                    .projectType(ProjectType.STUDY)
                    .projectMode(ProjectMode.OFFLINE)
                    .totalMembers(10)
                    .duration("1 year")
                    .deadline(LocalDateTime.of(2026, 12, 31, 23, 59))
                    .startDate(LocalDate.of(2026, 1, 1))
                    .techStacks(Set.of(TechStack.JAVASCRIPT, TechStack.FLUTTER))
                    .teams(Set.of())
                    .requiredPositions(List.of(JobPosition.BACKEND, JobPosition.DATA_SCIENTIST))
                    .build();
        }
    }
}