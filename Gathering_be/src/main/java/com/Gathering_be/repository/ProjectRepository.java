package com.Gathering_be.repository;

import com.Gathering_be.domain.Member;
import com.Gathering_be.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findProjectsByProfileId(Long profileId);
    List<Project> findByTitleContaining(String keyword);
    List<Project> findByDescriptionContaining(String keyword);
    List<Project> findByTitleContainingOrDescriptionContaining(String titleKeyword, String descriptionKeyword);
}
