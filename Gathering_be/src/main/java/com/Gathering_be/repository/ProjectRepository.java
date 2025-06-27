package com.Gathering_be.repository;

import com.Gathering_be.domain.Project;
import com.Gathering_be.repository.custom.ProjectRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long>, ProjectRepositoryCustom {
    List<Project> findAllByDeadlineBeforeAndIsClosedFalse(LocalDateTime now);
    @Query(value = "SELECT * FROM project WHERE id = :id", nativeQuery = true)
    Optional<Project> findByIdIncludeDeleted(@Param("id") Long id);
}