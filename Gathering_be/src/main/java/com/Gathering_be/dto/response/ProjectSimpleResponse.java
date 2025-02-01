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
    public ProjectSimpleResponse(ProjectType projectType, LocalDateTime createdAt, LocalDateTime updatedAt,
                                 LocalDateTime deadline, String title, String authorNickname, List<String> requiredPositions,
                                 Set<String> techStacks, boolean isClosed) {
        this.projectType = projectType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deadline = deadline;
        this.title = title;
        this.authorNickname = authorNickname;
        this.requiredPositions = requiredPositions;
        this.techStacks = techStacks;
        this.isClosed = isClosed;
    }

    public static ProjectSimpleResponse from(Project project) {
        return ProjectSimpleResponse.builder()
                .projectType(project.getProjectType())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .deadline(project.getDeadline())
                .title(project.getTitle())
                .authorNickname(project.getProfile().getNickname())
                .requiredPositions(project.getRequiredPositions())
                .techStacks(project.getTechStacks())
                .isClosed(project.isClosed())
                .build();
    }
}
