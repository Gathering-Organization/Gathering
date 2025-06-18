package com.Gathering_be.dto.request;

import com.Gathering_be.global.enums.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RoleUpdateRequest {
    private Role newRole;
}