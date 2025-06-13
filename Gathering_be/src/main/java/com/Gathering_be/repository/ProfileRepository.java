package com.Gathering_be.repository;

import com.Gathering_be.domain.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    @Query("SELECT p FROM Profile p JOIN p.member m WHERE " +
            "(:keyword IS NULL OR p.nickname LIKE %:keyword% OR m.email LIKE %:keyword%)")
    Page<Profile> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
}