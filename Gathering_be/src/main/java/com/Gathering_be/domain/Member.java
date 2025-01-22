package com.Gathering_be.domain;

import com.Gathering_be.global.common.BaseTimeEntity;
import com.Gathering_be.global.enums.OAuthProvider;
import com.Gathering_be.global.enums.Role;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class Member extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    @Column
    private String password;

    @Enumerated(EnumType.STRING)
    private OAuthProvider provider;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(nullable = false, unique = true)
    private String nickname;

    public void changeNickname(String nickname) {
        this.nickname = nickname;
    }

    @Builder(builderClassName = "OAuthMemberBuilder", builderMethodName = "oAuthBuilder")
    public Member(String email, String name, String nickname, OAuthProvider provider) {
        this.email = email;
        this.name = name;
        this.nickname = nickname;
        this.provider = provider;
        this.role = Role.ROLE_USER;
    }

    @Builder(builderClassName = "LocalMemberBuilder", builderMethodName = "localBuilder")
    public Member(String email, String name, String nickname, String password) {
        this.email = email;
        this.name = name;
        this.nickname = nickname;
        this.password = password;
        this.provider = OAuthProvider.BASIC;
        this.role = Role.ROLE_USER;
    }
}
