package com.Gathering_be.repository;

import com.Gathering_be.domain.Project;
import com.Gathering_be.repository.custom.ProjectRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long>, ProjectRepositoryCustom {
    Page<Project> findAllByProfileNickname(String nickname, Pageable pageable);
    Page<Project> findAllByProfileNicknameAndIsClosed(String nickname, boolean isClosed, Pageable pageable);
    List<Project> findAllByDeadlineBeforeAndIsClosedFalse(LocalDateTime now);
    @Query("SELECT p FROM Project WHERE p.id = :id")
    Optional<Project> findByIdIncludeDeleted(@Param("id") Long id);
}