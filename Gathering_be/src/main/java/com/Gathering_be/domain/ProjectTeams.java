package com.Gathering_be.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class ProjectTeams {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "profile_id")
    private Profile profile;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Builder
    public ProjectTeams(Profile profile, Project project) {
        this.profile = profile;
        this.project = project;
    }
}
