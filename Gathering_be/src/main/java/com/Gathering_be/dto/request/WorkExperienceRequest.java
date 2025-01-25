package com.Gathering_be.dto.request;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkExperienceRequest {
    private LocalDate startDate;
    private LocalDate endDate;
    private String activityName;
    private String jobDetail;
    private String description;

    @Builder
    public WorkExperienceRequest(LocalDate startDate, LocalDate endDate,
                                 String activityName, String jobDetail, String description) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.activityName = activityName;
        this.jobDetail = jobDetail;
        this.description = description;
    }
}