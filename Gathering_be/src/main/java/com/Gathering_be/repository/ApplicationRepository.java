package com.Gathering_be.repository;

import com.Gathering_be.domain.Application;
import com.Gathering_be.domain.Project;
import com.Gathering_be.global.enums.ApplyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByProjectId(Long projectId);
    boolean existsByProfileIdAndProjectId(Long profileId, Long projectId);
    Page<Application> findByProfileNickname(String nickname, Pageable pageable);
    Page<Application> findByProfileNicknameAndStatus(String nickname, ApplyStatus status, Pageable pageable);
    List<Application> findAllByProjectAndStatus(Project project, ApplyStatus status);
}
