package com.Gathering_be.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class LinkAccountRequest {
    private String email;
    private String password;
}
