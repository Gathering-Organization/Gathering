package com.Gathering_be.repository;

import com.Gathering_be.domain.Application;
import com.Gathering_be.domain.InterestProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByProjectId(Long projectId);
    @Query("SELECT app FROM Application app WHERE app.profile.nickname = :nickname")
    List<Application> findByNickname(@Param("nickname") String nickname);
    boolean existsByProfileIdAndProjectId(Long profileId, Long projectId);
}
