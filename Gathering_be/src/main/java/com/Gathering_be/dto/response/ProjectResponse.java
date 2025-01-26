package com.Gathering_be.dto.response;

import com.Gathering_be.domain.Project;
import com.Gathering_be.global.enums.ProjectMode;
import com.Gathering_be.global.enums.ProjectType;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectResponse {
    private String title;
    private String description;
    private String authorNickname;
    private ProjectType projectType;
    private ProjectMode projectMode;
    private int totalMembers;
    private LocalDate startDate;
    // private 팀원 태그
    private String duration;
    private List<String> requiredPositions;
    private Set<String> techStacks;
    private boolean isClosed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder
    public ProjectResponse(Project project) {
        this.title = project.getTitle();
        this.description = project.getDescription();
        this.authorNickname = project.getMember().getNickname();
        this.projectType = project.getProjectType();
        this.projectMode = project.getProjectMode();
        this.totalMembers = project.getTotalMembers();
        this.startDate = project.getStartDate();
        this.duration = project.getDuration();
        this.requiredPositions = project.getRequiredPositions();
        this.techStacks = project.getTechStacks();
        this.isClosed = project.isClosed();
        this.createdAt = project.getCreatedAt();
        this.updatedAt = project.getUpdatedAt();
    }
}
