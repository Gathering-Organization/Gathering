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

import static org.junit.jupiter.api.Assertions.assertEquals;
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
                .title("Test Project 1")
                .description("첫 번째 테스트 프로젝트")
                .build());

        project2 = projectRepository.save(Project.builder()
                .profile(owner)
                .title("Test Project 2")
                .description("두 번째 테스트 프로젝트")
                .build());
    }

    @Test
    @DisplayName("프로필 id로 등록한 모든 프로젝트들 조회 성공.")
    void findProjectsByProfileIdTest() {
        List<Project> projects = projectRepository.findProjectsByProfileId(owner.getId());

        assertEquals(2, projects.size());
        assertTrue(projects.contains(project1));
        assertTrue(projects.contains(project2));
    }
}

