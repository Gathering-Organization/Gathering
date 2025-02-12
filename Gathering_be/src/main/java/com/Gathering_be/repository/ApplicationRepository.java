package com.Gathering_be.repository;

import com.Gathering_be.domain.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByProjectId(Long projectId);
    List<Application> findByProfileId(Long profileId);
    boolean existsByProfileIdAndProjectId(Long profileId, Long projectId);
}
