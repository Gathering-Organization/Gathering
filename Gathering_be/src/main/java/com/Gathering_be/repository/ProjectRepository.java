package com.Gathering_be.repository;

import com.Gathering_be.domain.Project;
import com.Gathering_be.repository.custom.ProjectRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long>, ProjectRepositoryCustom {
    Page<Project> findAll(Pageable pageable);
    Page<Project> findAllByProfileNickname(String nickname, Pageable pageable);
    Page<Project> findAllByProfileNicknameAndIsClosed(String nickname, boolean isClosed, Pageable pageable);
}
