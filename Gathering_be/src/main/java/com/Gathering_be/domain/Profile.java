package com.Gathering_be.domain;

import com.Gathering_be.dto.request.ProfileUpdateRequest;
import com.Gathering_be.global.common.BaseTimeEntity;
import com.Gathering_be.global.enums.ApplyStatus;
import com.Gathering_be.global.enums.TechStack;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Profile extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(nullable = false, unique = true)
    private String nickname;

    private String profileColor = "000000";

    @Column(columnDefinition = "TEXT")
    private String introduction;

    @Embedded
    private Portfolio portfolio;

    @JsonProperty("public")
    private boolean isPublic;
    private String organization;

    @ElementCollection(targetClass = TechStack.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "tech_stacks", joinColumns = @JoinColumn(name = "profile_id"))
    private Set<TechStack> techStacks = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "work_experiences", joinColumns = @JoinColumn(name = "profile_id"))
    private List<WorkExperience> workExperiences = new ArrayList<>();

    @OneToMany(mappedBy = "profile")
    private Set<ProjectTeams> teams = new HashSet<>();

    private int totalProjects;
    private int openedProjects;
    private int closedProjects;

    private int totalApplications;
    private int pendingApplications;
    private int approvedApplications;
    private int rejectedApplications;

    @Builder
    public Profile(Member member, String nickname, String profileColor,
                   String introduction, Portfolio portfolio, boolean isPublic) {
        this.member = member;
        this.nickname = nickname;
        this.profileColor = profileColor != null ? profileColor : "000000";
        this.introduction = introduction;
        this.portfolio = portfolio;
        this.isPublic = isPublic;
    }

    public void update(ProfileUpdateRequest request) {
        if (request.getNickname() != null) {
            this.nickname = request.getNickname();
        }
        if (request.getProfileColor() != null) {
            this.profileColor = request.getProfileColor();
        }
        this.introduction = request.getIntroduction();
        this.organization = request.getOrganization();

        if (request.getTechStacks() != null) {
            this.techStacks.clear();
            this.techStacks.addAll(request.getTechStacks());
        }

        if (request.getWorkExperiences() != null) {
            this.workExperiences.clear();
            request.getWorkExperiences().forEach(exp ->
                    this.workExperiences.add(WorkExperience.from(exp)));
        }
    }

    public void updatePortfolio(String url, String fileName) {
        this.portfolio = Portfolio.builder()
                .url(url)
                .fileName(fileName)
                .build();
    }

    public void removePortfolio() {
        this.portfolio = null;
    }

    public void togglePublic() {
        this.isPublic = !this.isPublic;
    }

    public void addProject() {
        totalProjects++;
        openedProjects++;
    }

    public void removeProject(boolean isClosed) {
        totalProjects--;
        if (isClosed) {
            closedProjects--;
        } else {
            openedProjects--;
        }
    }

    public void toggleProjectStatus(boolean isClosing) {
        if (isClosing) {
            openedProjects--;
            closedProjects++;
        } else {
            openedProjects++;
            closedProjects--;
        }
    }

    public void addApplication() {
        totalApplications++;
        pendingApplications++;
    }

    public void removePendingApplication() {
        totalApplications--;
        pendingApplications--;
    }

    public void updateApplicationStatus(ApplyStatus newStatus) {
        pendingApplications--;

        if (newStatus == ApplyStatus.APPROVED) {
            approvedApplications++;
        } else if (newStatus == ApplyStatus.REJECTED) {
            rejectedApplications++;
        }
    }
}