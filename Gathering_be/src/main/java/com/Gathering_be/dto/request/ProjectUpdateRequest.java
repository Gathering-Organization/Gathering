package com.Gathering_be.dto.request;

import com.Gathering_be.domain.Profile;
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
public class ProjectUpdateRequest {
    private String title;
    private String description;
    private String kakaoUrl;

    private ProjectType projectType;
    private int totalMembers;
    private String duration;
    private LocalDateTime deadline;
    private LocalDate startDate;
    private boolean isClosed;
    private ProjectMode projectMode;

    private Set<String> techStacks;
    private List<String> requiredPositions;
    private Set<Profile> teams;

    @Builder
    public ProjectUpdateRequest(String title, String description, String kakaoUrl,
                                ProjectType projectType, int totalMembers, String duration,
                                LocalDateTime deadline, LocalDate startDate, boolean isClosed,
                                ProjectMode projectMode, Set<String> techStacks,
                                List<String> requiredPositions, Set<Profile> teams) {
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
        this.isClosed = isClosed;
        this.projectMode = projectMode;
        this.teams = teams;
    }
}
