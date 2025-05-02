package com.Gathering_be.service;

import com.Gathering_be.domain.Application;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.domain.Project;
import com.Gathering_be.dto.request.ApplicationRequest;
import com.Gathering_be.dto.response.ApplicationResponse;
import com.Gathering_be.dto.response.ProjectSimpleResponse;
import com.Gathering_be.exception.*;
import com.Gathering_be.global.enums.ApplyStatus;
import com.Gathering_be.global.service.S3Service;
import com.Gathering_be.repository.ApplicationRepository;
import com.Gathering_be.repository.InterestProjectRepository;
import com.Gathering_be.repository.ProfileRepository;
import com.Gathering_be.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final ProfileRepository profileRepository;
    private final ProjectRepository projectRepository;
    private final InterestProjectRepository interestProjectRepository;
    private final S3Service s3Service;

    @Transactional
    public void applyForProject(ApplicationRequest request) {
        Long currentUserId = getCurrentUserId();
        Profile profile = profileRepository.findByMemberId(currentUserId)
                .orElseThrow(ProfileNotFoundException::new);

        Project project = findProjectById(request.getProjectId());

        if (project.getProfile().getMember().getId().equals(currentUserId)) {
            throw new SelfApplicationNotAllowedException();
        }

        if (applicationRepository.findAll().stream().anyMatch(
                a -> a.getProject().getId().equals(project.getId()) &&
                        a.getProfileFromSnapshot().getId().equals(profile.getId()))) {
            throw new ApplicationAlreadyExistsException();
        }

        Application application = Application.builder()
                .profile(profile)
                .project(project)
                .position(request.getPosition())
                .message(request.getMessage())
                .build();

        profile.addApplication();
        applicationRepository.save(application);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsForProject(Long projectId) {
        Long currentUserId = getCurrentUserId();
        Project project = findProjectById(projectId);

        if (!project.getProfile().getMember().getId().equals(currentUserId)) {
            throw new UnauthorizedAccessException();
        }

        return applicationRepository.findByProjectId(projectId)
                .stream()
                .map(app -> ApplicationResponse.from(app, s3Service))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ApplicationResponse getMyApplicationByProjectId(Long projectId) {
        Long currentUserId = getCurrentUserId();

        Profile profile = profileRepository.findByMemberId(currentUserId)
                .orElseThrow(ProfileNotFoundException::new);

        List<Application> applications = applicationRepository.findByProjectId(projectId);

        Application myApp = applications.stream()
                .filter(app -> app.getProfileFromSnapshot().getId().equals(profile.getId()))
                .findFirst()
                .orElseThrow(ApplicationNotFoundException::new);

        return ApplicationResponse.from(myApp, s3Service);
    }

    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getApplicationsByNickname(String nickname, int page, int size, ApplyStatus status) {
        Profile profile = profileRepository.findByNickname(nickname)
                .orElseThrow(ProfileNotFoundException::new);

        if (!profile.getMember().getId().equals(getCurrentUserId())) {
            throw new UnauthorizedAccessException();
        }

        List<Application> applications = applicationRepository.findAll().stream()
                .filter(app -> app.getProfileFromSnapshot().getId().equals(profile.getId()))
                .filter(app -> status == null || app.getStatus() == status)
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());

        int start = Math.min((page - 1) * size, applications.size());
        int end = Math.min(start + size, applications.size());

        List<ApplicationResponse> content = applications.subList(start, end).stream()
                .map(app -> ApplicationResponse.from(app, s3Service))
                .collect(Collectors.toList());

        return new PageImpl<>(content, PageRequest.of(page - 1, size), applications.size());
    }

    @Transactional(readOnly = true)
    public Page<ProjectSimpleResponse> getMyAppliedProjects(int page, int size, ApplyStatus status) {
        Long currentUserId = getCurrentUserId();

        Profile profile = profileRepository.findByMemberId(currentUserId)
                .orElseThrow(ProfileNotFoundException::new);

        List<Application> applications = applicationRepository.findAll().stream()
                .filter(app -> app.getProfileFromSnapshot().getId().equals(profile.getId()))
                .filter(app -> status == null || app.getStatus() == status)
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());

        Set<Long> interestedProjectIds = interestProjectRepository.findAllByProfileId(profile.getId())
                .stream()
                .map(interest -> interest.getProject().getId())
                .collect(Collectors.toSet());

        int start = Math.min((page - 1) * size, applications.size());
        int end = Math.min(start + size, applications.size());

        List<ProjectSimpleResponse> content = applications.subList(start, end).stream()
                .map(app -> {
                    Project project = app.getProject();
                    ApplyStatus applyStatus = app.getStatus();
                    boolean isInterested = interestedProjectIds.contains(project.getId());
                    return ProjectSimpleResponse.from(project, isInterested, applyStatus);
                })
                .collect(Collectors.toList());

        return new PageImpl<>(content, PageRequest.of(page - 1, size), applications.size());
    }

    @Transactional
    public void deleteApplication(Long applicationId) {
        Long currentUserId = getCurrentUserId();

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(ApplicationNotFoundException::new);

        Profile profile = profileRepository.findByMemberId(currentUserId)
                .orElseThrow(ProfileNotFoundException::new);

        if (!profile.getMember().getId().equals(currentUserId)) {
            throw new UnauthorizedAccessException();
        }

        if (application.getStatus() != ApplyStatus.PENDING) {
            throw new ApplicationAlreadyProcessedException();
        }

        profile.removePendingApplication();
        applicationRepository.delete(application);
    }

    @Transactional
    public void updateApplicationStatus(Long applicationId, ApplyStatus newStatus) {
        Long currentUserId = getCurrentUserId();

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(ApplicationNotFoundException::new);

        Project project = application.getProject();

        if (!project.getProfile().getMember().getId().equals(currentUserId)) {
            throw new UnauthorizedAccessException();
        }

        if (application.getStatus() != ApplyStatus.PENDING) {
            throw new ApplicationAlreadyProcessedException();
        }

        Profile applicantProfile = profileRepository.findById(application.getProfileFromSnapshot().getId())
                .orElseThrow(ProfileNotFoundException::new);

        applicantProfile.updateApplicationStatus(newStatus);
        application.updateStatus(newStatus);
    }


    private Project findProjectById(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(ProjectNotFoundException::new);
    }

    private Long getProfileIdByMemberId(Long memberId) {
        Profile profile = profileRepository.findByMemberId(memberId)
                .orElseThrow(ProfileNotFoundException::new);
        return profile.getId();
    }

    private Long getCurrentUserId() {
        return Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
    }
}
