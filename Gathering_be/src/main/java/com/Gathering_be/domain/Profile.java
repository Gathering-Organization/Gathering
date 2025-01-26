package com.Gathering_be.domain;

import com.Gathering_be.dto.request.ProfileUpdateRequest;
import com.Gathering_be.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

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
    private String introduction;
    private String portfolioUrl;
    private boolean isPublic;

    @ElementCollection
    @CollectionTable(name = "work_experiences", joinColumns = @JoinColumn(name = "profile_id"))
    private List<WorkExperience> workExperiences = new ArrayList<>();

    @Builder
    public Profile(Member member, String nickname, String profileColor,
                   String introduction, String portfolioUrl, boolean isPublic) {
        this.member = member;
        this.nickname = nickname;
        this.profileColor = profileColor != null ? profileColor : "000000";
        this.introduction = introduction;
        this.portfolioUrl = portfolioUrl;
        this.isPublic = isPublic;
    }

    public void update(ProfileUpdateRequest request) {
        if (request.getNickname() != null) {
            this.nickname = request.getNickname();
        }
        this.introduction = request.getIntroduction();

        if (request.getWorkExperiences() != null) {
            this.workExperiences.clear();
            request.getWorkExperiences().forEach(exp ->
                    this.workExperiences.add(WorkExperience.from(exp)));
        }
    }

    public void updatePortfolio(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
    }

    public void removePortfolio() {
        this.portfolioUrl = null;
    }

    public void togglePublic() {
        this.isPublic = !this.isPublic;
    }
}