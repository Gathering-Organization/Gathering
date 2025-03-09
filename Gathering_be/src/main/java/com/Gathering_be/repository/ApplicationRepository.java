package com.Gathering_be.repository;

import com.Gathering_be.domain.Application;
import com.Gathering_be.domain.InterestProject;
import com.Gathering_be.global.enums.ApplyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByProjectId(Long projectId);
    boolean existsByProfileIdAndProjectId(Long profileId, Long projectId);
    Page<Application> findByProfileNickname(String nickname, Pageable pageable);
    Page<Application> findByProfileNicknameAndStatus(String nickname, ApplyStatus status, Pageable pageable);

    @Query("SELECT a FROM Application a WHERE a.profile.nickname = :nickname")
    List<Application> findByNickname(@Param("nickname") String nickname);

    @Modifying
    @Query("UPDATE Application a SET a.status = 'REJECTED' WHERE a.project.id = :projectId AND a.status = 'PENDING'")
    void updatePendingApplicationsToRejected(@Param("projectId") Long projectId);
}
