package com.Gathering_be.dto.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class MemberCountForAdminResponse {
    private final long totalMemberCount;

    public static MemberCountForAdminResponse from(long count) {
        return new MemberCountForAdminResponse(count);
    }
}
