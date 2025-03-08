package com.Gathering_be.repository;

import com.Gathering_be.domain.InterestProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InterestProjectRepository extends JpaRepository<InterestProject, Long> {
    List<InterestProject> findByProfileNickname(String nickname);
    boolean existsByProfileIdAndProjectId(Long profileId, Long projectId);
    void deleteByProfileIdAndProjectId(Long profileId, Long projectId);
    List<InterestProject> findAllByProfileId(Long profileId);
}
