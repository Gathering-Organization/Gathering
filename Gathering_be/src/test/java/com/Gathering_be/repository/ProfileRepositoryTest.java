package com.Gathering_be.repository;

import com.Gathering_be.domain.Member;
import com.Gathering_be.domain.Profile;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

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
        Profile profile = profileRepository.save(Profile.builder()
                .member(member)
                .nickname("테스트닉네임")
                .profileColor("000000")
                .introduction("테스트 소개")
                .isPublic(true)
                .build());

        Optional<Profile> foundProfile = profileRepository.findByMemberId(member.getId());

        assertThat(foundProfile).isPresent();
        assertThat(foundProfile.get().getMember().getId()).isEqualTo(member.getId());
        assertThat(foundProfile.get().getNickname()).isEqualTo(profile.getNickname());
    }

    @Test
    @DisplayName("닉네임으로 프로필 존재 여부 확인")
    void existsByNickname_Success() {
        Member member = memberRepository.save(createMockMember());
        Profile profile = profileRepository.save(Profile.builder()
                .member(member)
                .nickname("테스트닉네임")
                .profileColor("000000")
                .isPublic(true)
                .build());

        boolean exists = profileRepository.existsByNickname("테스트닉네임");
        assertThat(exists).isTrue();
    }

    private Member createMockMember() {
        return Member.localBuilder()
                .email("test@test.com")
                .name("테스트")
                .password("password")
                .build();
    }
}
