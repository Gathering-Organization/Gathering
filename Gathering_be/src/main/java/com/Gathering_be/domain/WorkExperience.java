package com.Gathering_be.domain;

import com.Gathering_be.dto.request.WorkExperienceRequest;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkExperience {
    private LocalDate startDate;
    private LocalDate endDate;
    private String activityName;
    private String jobDetail;
    private String description;

    @Builder
    public WorkExperience(LocalDate startDate, LocalDate endDate,
                          String activityName, String jobDetail, String description) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.activityName = activityName;
        this.jobDetail = jobDetail;
        this.description = description;
    }

    public static WorkExperience from(WorkExperienceRequest request) {
        return WorkExperience.builder()
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .activityName(request.getActivityName())
                .jobDetail(request.getJobDetail())
                .description(request.getDescription())
                .build();
    }
}