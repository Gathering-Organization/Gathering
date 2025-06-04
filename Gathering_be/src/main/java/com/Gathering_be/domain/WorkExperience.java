package com.Gathering_be.domain;

import com.Gathering_be.dto.request.WorkExperienceRequest;
import com.Gathering_be.global.enums.TechStack;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.Set;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkExperience {
    private LocalDate startDate;
    private LocalDate endDate;
    private Set<TechStack> techStacks;

    @Column(columnDefinition = "TEXT")
    private String activityName;
    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder
    public WorkExperience(LocalDate startDate, LocalDate endDate,
                          String activityName, Set<TechStack> techStacks, String description) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.activityName = activityName;
        this.techStacks = techStacks;
        this.description = description;
    }

    public static WorkExperience from(WorkExperienceRequest request) {
        return WorkExperience.builder()
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .activityName(request.getActivityName())
                .techStacks(request.getTechStacks())
                .description(request.getDescription())
                .build();
    }
}