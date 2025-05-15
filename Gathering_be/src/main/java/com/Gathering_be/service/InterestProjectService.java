package com.Gathering_be.service;

import com.Gathering_be.domain.InterestProject;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.domain.Project;
import com.Gathering_be.dto.request.InterestProjectRequest;
import com.Gathering_be.dto.response.InterestProjectResponse;
import com.Gathering_be.exception.*;
import com.Gathering_be.repository.InterestProjectRepository;
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
public class InterestProjectService {
    private final ProfileRepository profileRepository;
    private final ProjectRepository projectRepository;
    private final InterestProjectRepository interestProjectRepository;

    @Transactional
    public boolean toggleInterestProject(InterestProjectRequest request) {
        Long currentUserId = getCurrentUserId();
        Profile profile = profileRepository.findByMemberId(currentUserId)
                .orElseThrow(ProfileNotFoundException::new);

        Long profileId = profile.getId();
        Long projectId = request.getProjectId();
        validateMemberAccess(profileId);

        boolean exists = interestProjectRepository.existsByProfileIdAndProjectId(profileId, projectId);

        if (exists) {
            interestProjectRepository.deleteByProfileIdAndProjectId(profileId, projectId);
            return false;
        }
        else {
            InterestProject interestProject = InterestProject.builder()
                    .profile(profile)
                    .project(getProjectById(projectId))
                    .build();
            interestProjectRepository.save(interestProject);
            return true;
        }
    }

    @Transactional(readOnly = true)
    public List<InterestProjectResponse> getInterestProjects(String nickname) {
        Long profileId = getProfileByNickname(nickname).getId();
        validateMemberAccess(profileId);

        List<InterestProject> interestProjects = interestProjectRepository.findByProfileNickname(nickname);
        return interestProjects.stream()
                .map(InterestProjectResponse::from)
                .collect(Collectors.toList());
    }

    private Profile getProfileById(Long id) {
        return profileRepository.findById(id)
                .orElseThrow(ProfileNotFoundException::new);
    }

    private Profile getProfileByNickname(String nickname) {
        return profileRepository.findByNickname(nickname)
                .orElseThrow(ProfileNotFoundException::new);
    }

    private Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(ProjectNotFoundException::new);
    }

    private void validateMemberAccess(Long profileId) {
        Profile profile = getProfileById(profileId);
        Long currentUserId = getCurrentUserId();
        if (!profile.getMember().getId().equals(currentUserId)) {
            throw new UnauthorizedAccessException();
        }
    }

    private Long getCurrentUserId() {
        return Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
    }
}
