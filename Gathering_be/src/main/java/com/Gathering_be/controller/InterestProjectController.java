package com.Gathering_be.controller;

import com.Gathering_be.dto.request.InterestProjectRequest;
import com.Gathering_be.dto.response.InterestProjectResponse;
import com.Gathering_be.global.response.ResultCode;
import com.Gathering_be.global.response.ResultResponse;
import com.Gathering_be.service.InterestProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project/interest")
@RequiredArgsConstructor
public class InterestProjectController {
    private final InterestProjectService interestProjectService;

    @PostMapping
    public ResultResponse toggleInterestProject(@RequestBody InterestProjectRequest request) {
        boolean isInterest = interestProjectService.toggleInterestProject(request);
        return ResultResponse.of(ResultCode.INTEREST_PROJECT_TOGGLE_SUCCESS, isInterest);
    }

    @GetMapping("/{nickname}")
    public ResultResponse getInterestProjects(@PathVariable String nickname) {
        List<InterestProjectResponse> projects = interestProjectService.getInterestProjects(nickname);
        return ResultResponse.of(ResultCode.INTEREST_PROJECT_GET_SUCCESS, projects);
    }
}
