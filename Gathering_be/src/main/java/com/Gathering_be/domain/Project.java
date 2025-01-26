package com.Gathering_be.domain;

import com.Gathering_be.dto.request.ProjectUpdateRequest;
import com.Gathering_be.global.common.BaseTimeEntity;
import com.Gathering_be.global.enums.ProjectMode;
import com.Gathering_be.global.enums.ProjectType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Project extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private String title;
    private String description;
    private String kakaoUrl;            // 카카오톡 URL
    private LocalDateTime deadline;     // 모집 데드라인
    private int totalMembers;           // 모집 인원
    private String duration;            // 예상 진행 기간 (예: "3개월", "6주")
    private LocalDate startDate;        // 시작 예정일
    private boolean isClosed;           // 모집 마감

    // private 팀원 태그
    
    @Enumerated(EnumType.STRING)
    private ProjectType projectType;    // 모집 구분 (헤커톤, 스터디 등)

    @Enumerated(EnumType.STRING)
    private ProjectMode projectMode;    // 프로젝트 진행 방식(온라인/오프라인)

    @ElementCollection
    @CollectionTable(name = "project_positions", joinColumns = @JoinColumn(name = "project_id"))
    private List<String> requiredPositions = new ArrayList<>(); // 필요 포지션 목록 (JSON)

    @ElementCollection
    @CollectionTable(name = "project_tech_stacks", joinColumns = @JoinColumn(name = "project_id"))
    private Set<String> techStacks = new HashSet<>(); // 필요 기술 스택

    @Builder
    public Project(Member member, String title, String description, String kakaoUrl,
                   LocalDateTime deadline, int totalMembers, String duration,
                   LocalDate startDate, ProjectType projectType, ProjectMode projectMode,
                   List<String> requiredPositions, Set<String> techStacks) {
        this.member = member;
        this.title = title;
        this.description = description;
        this.kakaoUrl = kakaoUrl;
        this.deadline = deadline;
        this.totalMembers = totalMembers;
        this.duration = duration;
        this.startDate = startDate;
        this.isClosed = false;
        this.projectType = projectType;
        this.projectMode = projectMode;
        this.requiredPositions = requiredPositions != null ? requiredPositions : new ArrayList<>();
        this.techStacks = techStacks;
    }

    public void update(ProjectUpdateRequest request) {
        this.title = request.getTitle();
        this.description = request.getDescription();
        this.kakaoUrl = request.getKakaoUrl();
        this.projectType = request.getProjectType();
        this.deadline = request.getDeadline();
        this.totalMembers = request.getTotalMembers();
        this.duration = request.getDuration();
        this.startDate = request.getStartDate();
        this.techStacks = request.getTechStacks();
        this.requiredPositions = request.getRequiredPositions();
        this.isClosed = request.isClosed();
    }
}
