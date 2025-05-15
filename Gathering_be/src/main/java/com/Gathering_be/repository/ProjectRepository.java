package com.Gathering_be.repository;

import com.Gathering_be.domain.Project;
import com.Gathering_be.repository.custom.ProjectRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long>, ProjectRepositoryCustom {
    Page<Project> findAllByProfileNickname(String nickname, Pageable pageable);
    Page<Project> findAllByProfileNicknameAndIsClosed(String nickname, boolean isClosed, Pageable pageable);
    List<Project> findAllByDeadlineBeforeAndIsClosedFalse(LocalDateTime now);
}