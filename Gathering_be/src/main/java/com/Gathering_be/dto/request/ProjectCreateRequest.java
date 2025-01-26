package com.Gathering_be.dto.request;

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
public class ProjectCreateRequest {
    private String title;
    private String description;
    private String kakaoUrl;

    private ProjectType projectType;
    private ProjectMode projectMode;
    private int totalMembers;
    private String duration;
    private LocalDateTime deadline;
    private LocalDate startDate;
    private boolean isClosed;

    private Set<String> techStacks;
    private List<String> requiredPositions;

    @Builder
    public ProjectCreateRequest(String title, String description, String kakaoUrl,
                                ProjectType projectType, int totalMembers, String duration,
                                LocalDateTime deadline, LocalDate startDate, ProjectMode projectMode,
                                Set<String> techStacks, List<String> requiredPositions) {
        this.title = title;
        this.description = description;
        this.kakaoUrl = kakaoUrl;
        this.projectType = projectType;
        this.totalMembers = totalMembers;
        this.duration = duration;
        this.deadline = deadline;
        this.startDate = startDate;
        this.techStacks = techStacks;
        this.requiredPositions = requiredPositions;
        this.isClosed = false;
        this.projectMode = projectMode;
    }
}
