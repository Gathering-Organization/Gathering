package com.Gathering_be.repository;

import com.Gathering_be.domain.InterestProject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterestProjectRepository extends JpaRepository<InterestProject, Long> {
    List<InterestProject> findByProfileId(Long profileId);
    boolean existsByProfileIdAndProjectId(Long profileId, Long projectId);
    void deleteByProfileIdAndProjectId(Long profileId, Long projectId);
}
