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
    private Long profileId;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Long projectId;

    @Builder
    public InterestProject(Long id, Long profileId, Long projectId) {
        this.id = id;
        this.profileId = profileId;
        this.projectId = projectId;
    }
}
