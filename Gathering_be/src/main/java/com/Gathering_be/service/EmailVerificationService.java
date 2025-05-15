package com.Gathering_be.service;

import com.Gathering_be.exception.DuplicateEmailException;
import com.Gathering_be.exception.InvalidEmailException;
import com.Gathering_be.exception.InvalidVerificationCodeException;
import com.Gathering_be.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {
    private final MemberRepository memberRepository;
    private final RedisService redisService;
    private final JavaMailSender javaMailSender;

    private final String VERIFICATION_PREFIX = "email:verification:";
    private final Duration EXPIRATION_TIME = Duration.ofMinutes(5);

    public void sendVerificationCode(String email) {
        if (email == null || !isValidEmail(email)) {
            throw new InvalidEmailException();
        }

        if (memberRepository.existsByEmail(email)) {
            throw new DuplicateEmailException();
        }

        String verificationCode = generateCode();
        redisService.setValues(VERIFICATION_PREFIX + email, verificationCode, EXPIRATION_TIME);
        sendEmail(email, verificationCode);
    }

    public boolean verifyCode(String email, String code) {
        String storedCode = redisService.getValues(VERIFICATION_PREFIX + email);
        if (storedCode == null || !storedCode.equals(code)) {
            throw new InvalidVerificationCodeException();
        }
        redisService.setValues("verified:" + email + code, "true", Duration.ofMinutes(10));
        return true;
    }

    private String generateCode() {
        return String.valueOf((int) (Math.random() * 900000) + 100000);
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";
        return email.matches(emailRegex);
    }

    private void sendEmail(String email, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("이메일 인증 코드");
        message.setText("인증 코드: " + code + "\n5분 내에 입력해주세요.");
        javaMailSender.send(message);
    }
}