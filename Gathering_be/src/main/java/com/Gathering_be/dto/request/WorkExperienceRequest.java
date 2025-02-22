package com.Gathering_be.dto.request;

import com.Gathering_be.global.enums.TechStack;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.Set;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkExperienceRequest {
    private LocalDate startDate;
    private LocalDate endDate;
    private String activityName;
    private Set<TechStack> techStacks;
    private String description;

    @Builder
    public WorkExperienceRequest(LocalDate startDate, LocalDate endDate,
                                 String activityName, Set<TechStack> techStacks, String description) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.activityName = activityName;
        this.techStacks = techStacks;
        this.description = description;
    }
}