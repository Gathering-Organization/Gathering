package com.Gathering_be.domain;

import com.Gathering_be.dto.request.ProfileUpdateRequest;
import com.Gathering_be.global.common.BaseTimeEntity;
import com.Gathering_be.global.enums.Career;
import com.Gathering_be.global.enums.JobPosition;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
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

    @Enumerated(EnumType.STRING)
    private Career career;

    @Column(length = 1000)
    private String introduction;

    @ElementCollection
    @CollectionTable(name = "profile_tech_stacks",
            joinColumns = @JoinColumn(name = "profile_id"))
    private Set<String> techStacks = new HashSet<>();

    private String githubUrl;
    private String notionUrl;
    private String profileImageUrl;
    private String portfolioUrl;

    @Builder
    public Profile(Member member, JobPosition jobPosition, String organization,
                   Career career, String introduction, Set<String> techStacks,
                   String githubUrl, String notionUrl, String profileImageUrl,
                   String portfolioUrl) {
        this.member = member;
        this.jobPosition = jobPosition;
        this.organization = organization;
        this.career = career;
        this.introduction = introduction;
        this.techStacks = techStacks;
        this.githubUrl = githubUrl;
        this.notionUrl = notionUrl;
        this.profileImageUrl = profileImageUrl;
        this.portfolioUrl = portfolioUrl;
    }

    public void update(ProfileUpdateRequest request, String profileImageUrl, String portfolioUrl) {
        if (profileImageUrl != null) {
            this.profileImageUrl = profileImageUrl;
        }
        if (portfolioUrl != null) {
            this.portfolioUrl = portfolioUrl;
        }
        this.jobPosition = request.getJobPosition();
        this.organization = request.getOrganization();
        this.career = request.getCareer();
        this.introduction = request.getIntroduction();
        this.techStacks = new HashSet<>(request.getTechStacks());
        this.githubUrl = request.getGithubUrl();
        this.notionUrl = request.getNotionUrl();
    }
}
