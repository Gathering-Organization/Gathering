package com.Gathering_be.repository;

import com.Gathering_be.domain.Member;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.domain.WorkExperience;
import com.Gathering_be.global.enums.Career;
import com.Gathering_be.global.enums.JobPosition;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


@DataJpaTest
class ProfileRepositoryTest {
    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Test
    @DisplayName("회원 ID로 프로필 조회 성공")
    void findByMemberId_Success() {
        Member member = memberRepository.save(createMockMember());
        Profile profile = profileRepository.save(createMockProfile(member));

        Optional<Profile> foundProfile = profileRepository.findByMemberId(member.getId());

        assertThat(foundProfile).isPresent();
        assertThat(foundProfile.get().getMember().getId()).isEqualTo(member.getId());
        assertThat(foundProfile.get().getJobPosition()).isEqualTo(profile.getJobPosition());
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
                .introduction("테스트 소개")
                .techStacks(new HashSet<>(Arrays.asList("Java", "Spring")))
                .profileColor("000000")
                .workExperiences(createMockWorkExperiences())
                .build();
    }

    private List<WorkExperience> createMockWorkExperiences() {
        return Arrays.asList(
                WorkExperience.builder()
                        .startDate(LocalDate.of(2022, 1, 1))
                        .endDate(LocalDate.of(2023, 1, 1))
                        .activityName("테스트 활동")
                        .jobDetail("테스트 직무")
                        .description("테스트 설명")
                        .build()
        );
    }
}
