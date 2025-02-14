package com.Gathering_be.service;

import com.Gathering_be.domain.Application;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.domain.Project;
import com.Gathering_be.dto.request.ApplicationRequest;
import com.Gathering_be.dto.response.ApplicationResponse;
import com.Gathering_be.exception.*;
import com.Gathering_be.repository.ApplicationRepository;
import com.Gathering_be.repository.ProfileRepository;
import com.Gathering_be.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
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

        applicationRepository.save(application);
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
    public List<ApplicationResponse> getApplicationsByNickname(String nickname) {
        Profile profile = profileRepository.findByNickname(nickname)
                .orElseThrow(ProfileNotFoundException::new);

        if (!profile.getMember().getId().equals(getCurrentUserId())) {
            throw new UnauthorizedAccessException();
        }

        return applicationRepository.findByNickname(profile.getNickname())
                .stream()
                .map(ApplicationResponse::from)
                .collect(Collectors.toList());
    }

    private Project findProjectById(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(ProjectNotFoundException::new);
    }

    private Long getCurrentUserId() {
        return Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
    }
}
