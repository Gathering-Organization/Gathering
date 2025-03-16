package com.Gathering_be.repository.custom;

import com.Gathering_be.domain.Project;
import com.Gathering_be.domain.QProject;
import com.Gathering_be.exception.InvalidSearchTypeException;
import com.Gathering_be.global.enums.*;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.QueryResults;
import com.querydsl.core.types.OrderSpecifier;
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

    @Override
    public Page<Project> searchProjectsWithFilters(Pageable pageable,
                                                   JobPosition position,
                                                   List<TechStack> techStacks,
                                                   ProjectType type,
                                                   ProjectMode mode,
                                                   Boolean isClosed,
                                                   SearchType searchType,
                                                   String keyword) {
        BooleanBuilder builder = new BooleanBuilder();

        if (searchType!= null && keyword != null && !keyword.isEmpty()) {
            switch (searchType) {
                case TITLE:
                    builder.and(project.title.containsIgnoreCase(keyword));
                    break;
                case CONTENT:
                    builder.and(project.description.containsIgnoreCase(keyword));
                    break;
                case TITLE_CONTENT:
                    builder.and(project.title.containsIgnoreCase(keyword)
                            .or(project.description.containsIgnoreCase(keyword)));
                    break;
                default:
                    throw new InvalidSearchTypeException();
            }
        }

        if (techStacks != null && !techStacks.isEmpty()) {
            BooleanBuilder techStackBuilder = new BooleanBuilder();
            for (TechStack tech : techStacks) {
                techStackBuilder.or(project.techStacks.contains(tech));
            }
            builder.and(techStackBuilder);
        }

        if (position != null && !position.equals("ALL")) {
            builder.and(project.requiredPositions.contains(position));
        }
        if (type != null && !type.equals("ALL")) {
            builder.and(project.projectType.eq(type));
        }
        if (mode != null && !mode.equals("ALL")) {
            builder.and(project.projectMode.eq(mode));
        }
        if (isClosed != null) {
            builder.and(project.isClosed.eq(isClosed));
        }

        QueryResults<Project> results = queryFactory
                .selectFrom(project)
                .where(builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(getOrderSpecifier(pageable))
                .fetchResults();

        return new PageImpl<>(results.getResults(), pageable, results.getTotal());
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
}