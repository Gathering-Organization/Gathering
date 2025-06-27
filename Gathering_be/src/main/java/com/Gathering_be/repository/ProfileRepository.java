package com.Gathering_be.repository;

import com.Gathering_be.domain.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByMemberId(Long memberId);
    Optional<Profile> findByNickname(String nickname);
    boolean existsByNickname(String nickname);
    List<Profile> findAllByNicknameIn(Set<String> nicknames);
    @Query(value = "SELECT p FROM Profile p JOIN FETCH p.member m")
    List<Profile> findAllWithMember();
}