package com.Gathering_be.domain;

import com.Gathering_be.dto.request.ProjectUpdateRequest;
import com.Gathering_be.global.common.BaseTimeEntity;
import com.Gathering_be.global.enums.JobPosition;
import com.Gathering_be.global.enums.ProjectMode;
import com.Gathering_be.global.enums.ProjectType;
import com.Gathering_be.global.enums.TechStack;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Where;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Where(clause = "is_deleted = false")
public class Project extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id")
    private Profile profile;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String kakaoUrl;
    private LocalDateTime deadline;
    private int totalMembers;
    private String duration;
    private LocalDate startDate;
    private boolean isClosed;
    private Long viewCount = 0L;

    @Enumerated(EnumType.STRING)
    private ProjectType projectType;

    @Enumerated(EnumType.STRING)
    private ProjectMode projectMode;

    @ElementCollection(targetClass = JobPosition.class)
    @CollectionTable(name = "project_positions", joinColumns = @JoinColumn(name = "project_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "positions")
    private List<JobPosition> requiredPositions = new ArrayList<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProjectTeams> teams = new HashSet<>();

    @ElementCollection(targetClass = TechStack.class)
    @CollectionTable(name = "project_tech_stacks", joinColumns = @JoinColumn(name = "project_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "tech_stacks")
    private Set<TechStack> techStacks = new HashSet<>();

    @Column(name = "is_deleted")
    private boolean isDeleted = false;

    @Builder
    public Project(Profile profile, String title, String description, String kakaoUrl,
                   LocalDateTime deadline, int totalMembers, String duration,
                   LocalDate startDate, ProjectType projectType, ProjectMode projectMode,
                   List<JobPosition> requiredPositions, Set<TechStack> techStacks,
                   Set<ProjectTeams> teams) {
        this.profile = profile;
        this.title = title;
        this.description = description;
        this.kakaoUrl = kakaoUrl;
        this.deadline = deadline;
        this.totalMembers = totalMembers;
        this.duration = duration;
        this.startDate = startDate;
        this.isClosed = false;
        this.projectType = projectType;
        this.projectMode = projectMode;
        this.requiredPositions = requiredPositions != null ? requiredPositions : new ArrayList<>();
        this.techStacks = techStacks != null ? techStacks : new HashSet<>();
        this.teams = teams != null ? teams : new HashSet<>();
        this.viewCount = 0L;
        this.isDeleted = false;
    }

    public void update(ProjectUpdateRequest request) {
        this.title = request.getTitle();
        this.description = request.getDescription();
        this.kakaoUrl = request.getKakaoUrl();
        this.projectType = request.getProjectType();
        this.deadline = request.getDeadline();
        this.totalMembers = request.getTotalMembers();
        this.duration = request.getDuration();
        this.startDate = request.getStartDate();
        this.techStacks = request.getTechStacks();
        this.requiredPositions = request.getRequiredPositions();
        this.projectMode = request.getProjectMode();
    }

    public void delete() {
        this.isDeleted = true;
    }

    public void incrementViewCount() { this.viewCount += 1; }
    public void toggleIsClosed() { this.isClosed = !this.isClosed; }
    public void closeProject() { this.isClosed = false; }
}
