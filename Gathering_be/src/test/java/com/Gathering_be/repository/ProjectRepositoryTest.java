package com.Gathering_be.repository;

import com.Gathering_be.domain.Member;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.domain.Project;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
class ProjectRepositoryTest {
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private ProfileRepository profileRepository;
    @Autowired
    private MemberRepository memberRepository;

    private Profile owner;
    private Project project1;
    private Project project2;

    @BeforeEach
    void setUp() {
        Member member = memberRepository.save(Member.localBuilder()
                .email("owner@test.com")
                .name("프로젝트 소유자")
                .password("password123")
                .build());

        owner = profileRepository.save(Profile.builder()
                .member(member)
                .nickname("소유자 닉네임")
                .profileColor("000000")
                .introduction("소개")
                .isPublic(true)
                .build());

        project1 = projectRepository.save(Project.builder()
                .profile(owner)
                .title("Test Project 1 입니다")
                .description("첫 번째 테스트 프로젝트")
                .build());

        project2 = projectRepository.save(Project.builder()
                .profile(owner)
                .title("Test Project 2")
                .description("두 번째 테스트 프로젝트 입니다")
                .build());
    }

    @Test
    @DisplayName("프로필 id로 등록한 모든 프로젝트들 조회 성공.")
    void findProjectsByProfileIdTest() {
        List<Project> projects = projectRepository.findProjectsByProfileId(owner.getId());

        assertThat(projects.size()).isEqualTo(2);
        assertThat(projects.contains(project1)).isTrue();
        assertThat(projects.contains(project2)).isTrue();
    }

    @Test
    @DisplayName("제목에 키워드가 포함된 프로젝트 검색 성공")
    void findByTitleContainingTest() {
        List<Project> projects = projectRepository.findByTitleContaining("Test Project 1");

        assertThat(projects.size()).isEqualTo(1);
        assertTrue(projects.contains(project1));
    }

    @Test
    @DisplayName("설명에 키워드가 포함된 프로젝트 검색 성공")
    void findByDescriptionContainingTest() {
        List<Project> projects = projectRepository.findByDescriptionContaining("두 번째");

        assertThat(projects.size()).isEqualTo(1);
        assertTrue(projects.contains(project2));
    }

    @Test
    @DisplayName("제목 또는 설명에 키워드가 포함된 프로젝트 검색 성공")
    void findByTitleContainingOrDescriptionContainingTest() {
        List<Project> projects = projectRepository.findByTitleContainingOrDescriptionContaining("입니다", "입니다");

        assertThat(projects.size()).isEqualTo(2);
        assertTrue(projects.contains(project1));
        assertTrue(projects.contains(project2));
    }
}

