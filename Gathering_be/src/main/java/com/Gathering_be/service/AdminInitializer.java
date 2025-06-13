package com.Gathering_be.service;

import com.Gathering_be.domain.Member;
import com.Gathering_be.global.enums.Role;
import com.Gathering_be.repository.MemberRepository;
import com.Gathering_be.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Profile({"dev", "local"})
@RequiredArgsConstructor
public class AdminInitializer implements ApplicationRunner {
    private final MemberRepository memberRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        String adminEmail = "admin@gathering.com";
        String adminPassword = "admin";
        String adminNickname = "admin";

        if (memberRepository.findByEmail(adminEmail).isEmpty()) {
            Member adminMember = Member.localBuilder()
                    .email(adminEmail)
                    .name("관리자")
                    .password(passwordEncoder.encode(adminPassword))
                    .build();
            adminMember.updateRole(Role.ROLE_ADMIN);
            Member savedAdminMember = memberRepository.save(adminMember);

            com.Gathering_be.domain.Profile adminProfile = com.Gathering_be.domain.Profile.builder()
                    .member(savedAdminMember)
                    .nickname(adminNickname)
                    .introduction("서비스 관리자입니다.")
                    .isPublic(true)
                    .build();
            profileRepository.save(adminProfile);

            log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            log.info("개발용 관리자 계정 및 프로필이 생성되었습니다.");
            log.info("Email: {}, Password: {}, Nickname: {}", adminEmail, adminPassword, adminNickname);
            log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        }
    }
}