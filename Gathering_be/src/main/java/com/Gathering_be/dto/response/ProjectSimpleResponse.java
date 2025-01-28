package com.Gathering_be.dto.response;

import com.Gathering_be.domain.Project;
import com.Gathering_be.global.enums.ProjectType;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectSimpleResponse {
    private ProjectType projectType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deadline;

    private String title;
    private String authorNickname;

    private List<String> requiredPositions;
    private Set<String> techStacks;
    private boolean isClosed;

    @Builder
    public ProjectSimpleResponse(Project project) {
        this.projectType = project.getProjectType();
        this.createdAt = project.getCreatedAt();
        this.updatedAt = project.getUpdatedAt();
        this.deadline = project.getDeadline();
        this.title = project.getTitle();
        this.authorNickname = project.getProfile().getNickname();
        this.requiredPositions = project.getRequiredPositions();
        this.techStacks = project.getTechStacks();
        this.isClosed = project.isClosed();
    }
}
