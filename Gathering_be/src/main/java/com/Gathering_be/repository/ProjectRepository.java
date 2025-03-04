package com.Gathering_be.repository;

import com.Gathering_be.domain.Project;
import com.Gathering_be.repository.custom.ProjectRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long>, ProjectRepositoryCustom {
    Page<Project> findAll(Pageable pageable);
    List<Project> findAllByProfileNickname(String nickname);
    List<Project> findByTitleContaining(String keyword);
    List<Project> findByDescriptionContaining(String keyword);
    List<Project> findByTitleContainingOrDescriptionContaining(String titleKeyword, String descriptionKeyword);
}
