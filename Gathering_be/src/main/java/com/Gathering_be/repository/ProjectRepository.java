package com.Gathering_be.repository;

import com.Gathering_be.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findProjectsByProfileId(Long profileId);
    List<Project> findAllByDeadlineBeforeAndIsClosedFalse(LocalDateTime now);
}
