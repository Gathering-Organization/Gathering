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
    private Long projectId;
    private ProjectType projectType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deadline;

    private String title;
    private String authorNickname;

    private List<String> requiredPositions;
    private Set<String> techStacks;
    private boolean isClosed;
    private boolean isInterested;

    @Builder
    public ProjectSimpleResponse(Long projectId, ProjectType projectType, LocalDateTime createdAt, LocalDateTime updatedAt,
                                 LocalDateTime deadline, String title, String authorNickname, List<String> requiredPositions,
                                 Set<String> techStacks, boolean isClosed, boolean isInterested) {
        this.projectId = projectId;
        this.projectType = projectType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deadline = deadline;
        this.title = title;
        this.authorNickname = authorNickname;
        this.requiredPositions = requiredPositions;
        this.techStacks = techStacks;
        this.isClosed = isClosed;
        this.isInterested = isInterested;
    }

    public static ProjectSimpleResponse from(Project project, boolean isInterested) {
        return ProjectSimpleResponse.builder()
                .projectId(project.getId())
                .projectType(project.getProjectType())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .deadline(project.getDeadline())
                .title(project.getTitle())
                .authorNickname(project.getProfile().getNickname())
                .requiredPositions(project.getRequiredPositions())
                .techStacks(project.getTechStacks())
                .isClosed(project.isClosed())
                .isInterested(isInterested)
                .build();
    }
}
