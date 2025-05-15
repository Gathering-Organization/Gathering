package com.Gathering_be.dto.response;

import com.Gathering_be.domain.WorkExperience;
import com.Gathering_be.global.enums.TechStack;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.Set;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkExperienceResponse {
    private LocalDate startDate;
    private LocalDate endDate;
    private String activityName;
    private Set<TechStack> techStacks;
    private String description;

    @Builder
    public WorkExperienceResponse(LocalDate startDate, LocalDate endDate,
                                  String activityName, Set<TechStack> techStacks, String description) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.activityName = activityName;
        this.techStacks = techStacks;
        this.description = description;
    }

    public static WorkExperienceResponse from(WorkExperience experience) {
        return WorkExperienceResponse.builder()
                .startDate(experience.getStartDate())
                .endDate(experience.getEndDate())
                .activityName(experience.getActivityName())
                .techStacks(experience.getTechStacks())
                .description(experience.getDescription())
                .build();
    }
}