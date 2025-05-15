package com.Gathering_be.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
public class InterestProject {
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
    public InterestProject(Long id, Profile profile, Project project) {
        this.id = id;
        this.profile = profile;
        this.project = project;
    }
}
