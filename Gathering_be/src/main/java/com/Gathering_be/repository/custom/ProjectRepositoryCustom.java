package com.Gathering_be.repository.custom;

import com.Gathering_be.domain.Project;
import com.Gathering_be.global.enums.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProjectRepositoryCustom {
    Page<Project> searchProjectsWithFilters(Pageable pageable, JobPosition position, List<TechStack> techStacks,
                                            ProjectType type, ProjectMode mode, Boolean isClosed,
                                            SearchType searchType, String keyword);
    Page<Project> searchProjectsForAdmin(Pageable pageable, JobPosition position, List<TechStack> techStacks,
                                            ProjectType type, ProjectMode mode, Boolean isClosed, Boolean isDeleted,
                                            SearchType searchType, String keyword);
}
