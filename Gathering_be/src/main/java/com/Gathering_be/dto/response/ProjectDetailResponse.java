package com.Gathering_be.dto.response;

import com.Gathering_be.domain.Project;
import com.Gathering_be.global.enums.ProjectMode;
import com.Gathering_be.global.enums.ProjectType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
public class ProjectDetailResponse {
    private final String title;
    private final String description;
    private final String authorNickname;
    private final String kakaoUrl;
    private final ProjectType projectType;
    private final ProjectMode projectMode;
    private final int totalMembers;
    private final LocalDate startDate;
    private final Set<ProfileResponse> teams;
    private final String duration;
    private final List<String> requiredPositions;
    private final Set<String> techStacks;
    private final boolean isClosed;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
    private final LocalDateTime deadline;

    @Builder
    public ProjectDetailResponse(String title, String description, String authorNickname, ProjectType projectType,
                                 ProjectMode projectMode, int totalMembers, LocalDate startDate, Set<ProfileResponse> teams,
                                 String duration, List<String> requiredPositions, Set<String> techStacks, String kakaoUrl,
                                 boolean isClosed, LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime deadline) {
        this.title = title;
        this.description = description;
        this.authorNickname = authorNickname;
        this.projectType = projectType;
        this.projectMode = projectMode;
        this.totalMembers = totalMembers;
        this.startDate = startDate;
        this.teams = teams;
        this.duration = duration;
        this.requiredPositions = requiredPositions;
        this.techStacks = techStacks;
        this.isClosed = isClosed;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deadline = deadline;
        this.kakaoUrl = kakaoUrl;
    }

    public static ProjectDetailResponse from(Project project) {
        Set<ProfileResponse> teams = project.getTeams().stream()
                .map(profile -> ProfileResponse.from(profile, false))
                .collect(Collectors.toSet());

        return ProjectDetailResponse.builder()
                .title(project.getTitle())
                .description(project.getDescription())
                .authorNickname(project.getProfile().getNickname())
                .projectType(project.getProjectType())
                .projectMode(project.getProjectMode())
                .totalMembers(project.getTotalMembers())
                .startDate(project.getStartDate())
                .teams(teams)
                .duration(project.getDuration())
                .requiredPositions(project.getRequiredPositions())
                .techStacks(project.getTechStacks())
                .isClosed(project.isClosed())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .deadline(project.getDeadline())
                .kakaoUrl(project.getKakaoUrl())
                .build();
    }
}
