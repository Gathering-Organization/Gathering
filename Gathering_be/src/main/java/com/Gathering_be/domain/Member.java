package com.Gathering_be.domain;

import com.Gathering_be.global.common.BaseTimeEntity;
import com.Gathering_be.global.enums.OAuthProvider;
import com.Gathering_be.global.enums.Role;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

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
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "member_providers", joinColumns = @JoinColumn(name = "member_id"))
    private Set<OAuthProvider> providers = new HashSet<>();

    @Enumerated(EnumType.STRING)
    private Role role;

    @Builder(builderClassName = "OAuthMemberBuilder", builderMethodName = "oAuthBuilder")
    public Member(String email, String name, OAuthProvider provider) {
        this.email = email;
        this.name = name;
        this.providers.add(provider);
        this.role = Role.ROLE_USER;
    }

    @Builder(builderClassName = "LocalMemberBuilder", builderMethodName = "localBuilder")
    public Member(String email, String name, String password) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.providers.add(OAuthProvider.BASIC);
        this.role = Role.ROLE_USER;
    }

    public void addProvider(OAuthProvider provider) { this.providers.add(provider); }
    public void updateRole(Role role) {
        this.role = role;
    }
}
