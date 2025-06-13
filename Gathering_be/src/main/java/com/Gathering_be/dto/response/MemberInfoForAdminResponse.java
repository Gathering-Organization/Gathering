package com.Gathering_be.dto.response;

import com.Gathering_be.domain.Member;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.global.enums.Role;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MemberInfoForAdminResponse {
    private Long memberId;
    private String email;
    private String memberName;
    private String nickname;
    private Role role;
    private LocalDateTime createdAt;

    public static MemberInfoForAdminResponse from(Profile profile) {
        Member member = profile.getMember();
        return new MemberInfoForAdminResponse(
                member.getId(),
                member.getEmail(),
                member.getName(),
                profile.getNickname(),
                member.getRole(),
                member.getCreatedAt()
        );
    }

    private MemberInfoForAdminResponse(Long memberId, String email, String memberName, String nickname, Role role, LocalDateTime createdAt) {
        this.memberId = memberId;
        this.email = email;
        this.memberName = memberName;
        this.nickname = nickname;
        this.role = role;
        this.createdAt = createdAt;
    }
}
