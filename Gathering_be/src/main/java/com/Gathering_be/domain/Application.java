package com.Gathering_be.domain;

import com.Gathering_be.exception.ProfileDeserializeFailedException;
import com.Gathering_be.exception.ProfileSerializeFailedException;
import com.Gathering_be.global.common.BaseTimeEntity;
import com.Gathering_be.global.enums.ApplyStatus;
import com.Gathering_be.global.enums.JobPosition;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Application extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String profileSnapshot;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Enumerated(EnumType.STRING)
    private JobPosition position;
    private String message;

    @Enumerated(EnumType.STRING)
    private ApplyStatus status;

    private static final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .registerModule(new Hibernate6Module())
            .disable(SerializationFeature.FAIL_ON_EMPTY_BEANS)
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @Builder
    public Application(Profile profile, Project project, JobPosition position, String message) {
        this.profileSnapshot = serializeProfile(profile);
        this.project = project;
        this.position = position;
        this.message = message;
        this.status = ApplyStatus.PENDING;
    }

    public Profile getProfileFromSnapshot() {
        try {
            return objectMapper.readValue(profileSnapshot, Profile.class);
        } catch (Exception e) {
            throw new ProfileDeserializeFailedException();
        }
    }

    private String serializeProfile(Profile profile) {
        try {
            profile.getTechStacks().size();
            profile.getWorkExperiences().size();
            return objectMapper.writeValueAsString(profile);
        } catch (Exception e) {
            throw new ProfileSerializeFailedException();
        }
    }

    public void updateStatus(ApplyStatus newStatus) {
        this.status = newStatus;
    }
    public void reject() {
        this.status = ApplyStatus.REJECTED;
        Profile profile = getProfileFromSnapshot();
        profile.updateApplicationStatus(ApplyStatus.REJECTED);
    }
}
