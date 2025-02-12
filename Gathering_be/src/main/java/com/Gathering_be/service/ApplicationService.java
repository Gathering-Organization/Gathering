package com.Gathering_be.service;

import com.Gathering_be.domain.Application;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.domain.Project;
import com.Gathering_be.dto.request.ApplicationRequest;
import com.Gathering_be.dto.response.ApplicationResponse;
import com.Gathering_be.exception.ApplicationAlreadyExistsException;
import com.Gathering_be.exception.ProfileNotFoundException;
import com.Gathering_be.exception.ProjectNotFoundException;
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
        Long memberId = getCurrentUserId();
        Profile profile = findProfileByMemberId(memberId);
        Project project = findProjectById(request.getProjectId());

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
        return applicationRepository.findByProjectId(projectId)
                .stream()
                .map(ApplicationResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsByProfile(Long profileId) {
        return applicationRepository.findByProfileId(profileId)
                .stream()
                .map(ApplicationResponse::from)
                .collect(Collectors.toList());
    }

    private Project findProjectById(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(ProjectNotFoundException::new);
    }

    private Profile findProfileByMemberId(Long memberId) {
        return profileRepository.findByMemberId(memberId)
                .orElseThrow(ProfileNotFoundException::new);
    }

    private Long getCurrentUserId() {
        return Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
    }
}
