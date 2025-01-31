package com.Gathering_be.repository;

import com.Gathering_be.domain.Member;
import com.Gathering_be.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findProjectsByProfileId(Long profileId);
}
