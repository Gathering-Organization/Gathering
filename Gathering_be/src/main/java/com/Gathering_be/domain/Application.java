package com.Gathering_be.domain;

import com.Gathering_be.global.enums.ApplyStatus;
import com.Gathering_be.global.enums.JobPosition;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "profile_id")
    private Profile profile;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Enumerated(EnumType.STRING)
    private JobPosition position;
    private String message;

    @Enumerated(EnumType.STRING)
    private ApplyStatus status;

    @Builder
    public Application(Profile profile, Project project, JobPosition position, String message) {
        this.profile = profile;
        this.project = project;
        this.position = position;
        this.message = message;
        this.status = ApplyStatus.PENDING;
    }
}
