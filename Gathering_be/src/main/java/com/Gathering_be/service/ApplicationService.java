package com.Gathering_be.service;

import com.Gathering_be.domain.Application;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.domain.Project;
import com.Gathering_be.dto.request.ApplicationRequest;
import com.Gathering_be.dto.response.ApplicationResponse;
import com.Gathering_be.exception.*;
import com.Gathering_be.global.enums.ApplyStatus;
import com.Gathering_be.repository.ApplicationRepository;
import com.Gathering_be.repository.ProfileRepository;
import com.Gathering_be.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final ProfileRepository profileRepository;
    private final ProjectRepository projectRepository;
    private final EmailService emailService;

    @Transactional
    public void applyForProject(ApplicationRequest request) {
        Long currentUserId = getCurrentUserId();
        Profile profile = profileRepository.findByMemberId(currentUserId)
                .orElseThrow(ProfileNotFoundException::new);

        Project project = findProjectById(request.getProjectId());

        if (project.getProfile().getMember().getId().equals(currentUserId)) {
            throw new SelfApplicationNotAllowedException();
        }

        if (applicationRepository.existsByProfileIdAndProjectId(profile.getId(), project.getId())) {
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

        emailService.sendNewApplyMail(project.getProfile().getMember().getEmail(), project.getTitle());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsByProject(Long projectId) {
        Long currentUserId = getCurrentUserId();
        Project project = findProjectById(projectId);

        if (!project.getProfile().getMember().getId().equals(currentUserId)) {
            throw new UnauthorizedAccessException();
        }

        return applicationRepository.findByProjectId(projectId)
                .stream()
                .map(ApplicationResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getApplicationsByNickname(String nickname, int page, int size, ApplyStatus status) {
        Profile profile = profileRepository.findByNickname(nickname)
                .orElseThrow(ProfileNotFoundException::new);

        if (!profile.getMember().getId().equals(getCurrentUserId())) {
            throw new UnauthorizedAccessException();
        }

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Application> applicationPage;

        if (status != null) {
            applicationPage = applicationRepository.findByProfileNicknameAndStatus(nickname, status, pageable);
        } else {
            applicationPage = applicationRepository.findByProfileNickname(nickname, pageable);
        }

        return applicationPage.map(ApplicationResponse::from);
    }

    @Transactional
    public void deleteApplication(Long applicationId) {
        Long currentUserId = getCurrentUserId();

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(ApplicationNotFoundException::new);

        if (!application.getProfile().getMember().getId().equals(currentUserId)) {
            throw new UnauthorizedAccessException();
        }

        if (application.getStatus() != ApplyStatus.PENDING) {
            throw new ApplicationAlreadyProcessedException();
        }

        application.getProfile().removePendingApplication();
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

        application.getProfile().updateApplicationStatus(newStatus);
        application.updateStatus(newStatus);

        String email = application.getProfile().getMember().getEmail();
        String nickname = application.getProfile().getNickname();
        boolean result = newStatus == ApplyStatus.APPROVED ? true : false;
        emailService.sendResultMail(email, project.getTitle(), nickname, result);
    }


    private Project findProjectById(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(ProjectNotFoundException::new);
    }

    private Long getCurrentUserId() {
        return Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
    }
}
