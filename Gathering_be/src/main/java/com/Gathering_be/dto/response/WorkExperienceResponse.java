package com.Gathering_be.dto.response;

import com.Gathering_be.domain.WorkExperience;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkExperienceResponse {
    private LocalDate startDate;
    private LocalDate endDate;
    private String activityName;
    private String jobDetail;
    private String description;

    @Builder
    public WorkExperienceResponse(LocalDate startDate, LocalDate endDate,
                                  String activityName, String jobDetail, String description) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.activityName = activityName;
        this.jobDetail = jobDetail;
        this.description = description;
    }

    public static WorkExperienceResponse from(WorkExperience experience) {
        return WorkExperienceResponse.builder()
                .startDate(experience.getStartDate())
                .endDate(experience.getEndDate())
                .activityName(experience.getActivityName())
                .jobDetail(experience.getJobDetail())
                .description(experience.getDescription())
                .build();
    }
}