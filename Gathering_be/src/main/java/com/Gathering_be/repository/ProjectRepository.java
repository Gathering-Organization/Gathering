package com.Gathering_be.repository;

import com.Gathering_be.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByProfileNickname(String nickname);
    List<Project> findByTitleContaining(String keyword);
    List<Project> findByDescriptionContaining(String keyword);
    List<Project> findByTitleContainingOrDescriptionContaining(String titleKeyword, String descriptionKeyword);
}
