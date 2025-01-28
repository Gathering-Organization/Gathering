package com.Gathering_be.dto;

import com.Gathering_be.domain.Profile;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProfileDTO {
    private Long id;
    private String nickname; // Profile에서 필요한 필드만 선택

    public static ProfileDTO from(Profile profile) {
        return new ProfileDTO(profile.getId(), profile.getNickname());
    }
}