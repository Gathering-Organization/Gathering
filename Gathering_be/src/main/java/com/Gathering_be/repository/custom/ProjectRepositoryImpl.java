package com.Gathering_be.repository.custom;

import com.Gathering_be.domain.Project;
import com.Gathering_be.domain.QProject;
import com.Gathering_be.exception.InvalidSearchTypeException;
import com.Gathering_be.global.enums.*;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ProjectRepositoryImpl implements ProjectRepositoryCustom {
    private final JPAQueryFactory queryFactory;
    private final QProject project = QProject.project;

    @Autowired
    public ProjectRepositoryImpl(EntityManager entityManager) {
        this.queryFactory = new JPAQueryFactory(entityManager);
    }

    // --- 1. 기존 사용자용 검색 메서드 ---
    // 이제 내부 헬퍼 메서드를 호출하는 역할만 합니다.
    @Override
    public Page<Project> searchProjectsWithFilters(Pageable pageable, JobPosition position, List<TechStack> techStacks, ProjectType type, ProjectMode mode, Boolean isClosed, SearchType searchType, String keyword) {
        // 공통 로직을 호출하여 조건절 생성
        BooleanBuilder builder = createCommonWhereBuilder(position, techStacks, type, mode, isClosed, searchType, keyword);

        // 쿼리 실행 로직 호출
        return executeQuery(builder, pageable);
    }

    // --- 2. [추가] 관리자용 검색 메서드 ---
    @Override
    public Page<Project> searchProjectsForAdmin(Pageable pageable, JobPosition position, List<TechStack> techStacks, ProjectType type, ProjectMode mode, Boolean isClosed, Boolean isDeleted, SearchType searchType, String keyword) {
        // 공통 로직을 호출하여 기본 조건절 생성
        BooleanBuilder builder = createCommonWhereBuilder(position, techStacks, type, mode, isClosed, searchType, keyword);

        // 관리자 전용 조건(isDeleted)을 추가
        if (isDeleted != null) {
            builder.and(project.isDeleted.eq(isDeleted));
        }

        // 쿼리 실행 로직 호출
        return executeQuery(builder, pageable);
    }

    // --- 3. [리팩토링] 공통 로직을 담당하는 private 헬퍼 메서드 ---
    private BooleanBuilder createCommonWhereBuilder(JobPosition position, List<TechStack> techStacks, ProjectType type, ProjectMode mode, Boolean isClosed, SearchType searchType, String keyword) {
        BooleanBuilder builder = new BooleanBuilder();

        // keyword 검색 조건
        if (searchType != null && keyword != null && !keyword.isEmpty()) {
            switch (searchType) {
                case TITLE -> builder.and(project.title.containsIgnoreCase(keyword));
                case CONTENT -> builder.and(project.description.containsIgnoreCase(keyword));
                case TITLE_CONTENT -> builder.and(project.title.containsIgnoreCase(keyword)
                        .or(project.description.containsIgnoreCase(keyword)));
                default -> throw new InvalidSearchTypeException();
            }
        }

        // techStacks 검색 조건
        if (techStacks != null && !techStacks.isEmpty()) {
            BooleanBuilder techStackBuilder = new BooleanBuilder();
            for (TechStack tech : techStacks) {
                techStackBuilder.or(project.techStacks.contains(tech));
            }
            builder.and(techStackBuilder);
        }

        // 기타 enum 조건
        if (position != null) {
            builder.and(project.requiredPositions.contains(position));
        }
        if (type != null) {
            builder.and(project.projectType.eq(type));
        }
        if (mode != null) {
            builder.and(project.projectMode.eq(mode));
        }
        if (isClosed != null) {
            builder.and(project.isClosed.eq(isClosed));
        }

        return builder;
    }

    // --- 4. [리팩토링] 쿼리 실행 로직을 담당하는 private 헬퍼 메서드 ---
    private Page<Project> executeQuery(BooleanBuilder builder, Pageable pageable) {
        JPAQuery<Project> query = queryFactory
                .selectFrom(project)
                .where(builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(getOrderSpecifier(pageable)); // 정렬 조건 적용

        List<Project> content = query.fetch();

        // Count 쿼리 최적화
        JPAQuery<Long> countQuery = queryFactory
                .select(project.count())
                .from(project)
                .where(builder);

        return new PageImpl<>(content, pageable, countQuery.fetchOne());
    }

    private OrderSpecifier<?> getOrderSpecifier(Pageable pageable) {
        for (Sort.Order order : pageable.getSort()) {
            switch (order.getProperty()) {
                case "createdAt":
                    return order.isAscending() ? project.createdAt.asc() : project.createdAt.desc();
                case "viewCount":
                    return order.isAscending() ? project.viewCount.asc() : project.viewCount.desc();
            }
        }
        return project.createdAt.desc();
}