package com.Gathering_be.repository;

import com.Gathering_be.domain.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByMemberId(Long memberId);
    Optional<Profile> findByNickname(String nickname);
    boolean existsByNickname(String nickname);
}