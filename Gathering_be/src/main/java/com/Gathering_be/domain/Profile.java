package com.Gathering_be.domain;

import com.Gathering_be.dto.request.ProfileUpdateRequest;
import com.Gathering_be.global.common.BaseTimeEntity;
import com.Gathering_be.global.enums.JobPosition;
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

    @Enumerated(EnumType.STRING)
    private JobPosition jobPosition;

    private String organization;

    @Column(length = 1000)
    private String introduction;

    @ElementCollection
    @CollectionTable(name = "profile_tech_stacks",
            joinColumns = @JoinColumn(name = "profile_id"))
    private Set<String> techStacks = new HashSet<>();

    private String portfolioUrl;
    private String profileImageUrl;
    private String profileColor = "000000";
    private boolean isPublic;

    @ElementCollection
    @CollectionTable(name = "profile_work_experiences",
            joinColumns = @JoinColumn(name = "profile_id"))
    private List<WorkExperience> workExperiences = new ArrayList<>();

    @Builder
    public Profile(Member member, JobPosition jobPosition, String organization,
                   String introduction, Set<String> techStacks,
                   String portfolioUrl, String profileImageUrl, String profileColor,
                   List<WorkExperience> workExperiences) {
        this.member = member;
        this.jobPosition = jobPosition;
        this.organization = organization;
        this.introduction = introduction;
        this.techStacks = techStacks;
        this.portfolioUrl = portfolioUrl;
        this.profileImageUrl = profileImageUrl;
        this.profileColor = profileColor != null ? profileColor : "000000";
        this.workExperiences = workExperiences != null ? workExperiences : new ArrayList<>();
        this.isPublic = true;
    }

    public void update(ProfileUpdateRequest request, String profileImageUrl, List<WorkExperience> workExperiences) {
        if (profileImageUrl != null) {
            this.profileImageUrl = profileImageUrl;
        }
        this.jobPosition = request.getJobPosition();
        this.organization = request.getOrganization();
        this.introduction = request.getIntroduction();
        this.techStacks = new HashSet<>(request.getTechStacks());
        this.portfolioUrl = request.getPortfolioUrl();
        this.profileColor = request.getProfileColor() != null ? request.getProfileColor() : "000000";
        this.workExperiences = workExperiences;
    }

    public void togglePublic() {
        this.isPublic = !this.isPublic;
    }
}