package com.Gathering_be.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;

    public void sendResultMail(String to, String projectTitle, String applicantName, boolean isApproved) {
        Context context = new Context();
        context.setVariable("projectTitle", projectTitle);
        context.setVariable("applicantName", applicantName);
        context.setVariable("link", "https://www.naver.com");

        String templateName = isApproved ? "approve" : "reject";
        String htmlContent = templateEngine.process(templateName, context);
        String subject = "[Gathering] 지원서 " + (isApproved ? "승인" : "거절") + " 안내";

        sendHtmlMail(to, subject, htmlContent);
    }

    public void sendCloseMail(String to, String projectTitle, String applicantName) {
        String subject = "[Gathering] 지원 프로젝트 마감 안내";
        String body = String.format(
                "안녕하세요, %s님!\n\n당신이 지원한 프로젝트 \"%s\"의 모집 기한이 지나 지원이 자동으로 거절되었습니다.\n감사합니다!",
                applicantName, projectTitle
        );

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        javaMailSender.send(message);
    }

    public void sendNewApplyMail(String to, String projectTitle) {
        String subject = "[Gathering] 새 지원서가 도착했습니다!";
        String body = String.format("당신의 프로젝트 \"%s\"에 새로운 지원서가 제출되었습니다.", projectTitle);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        javaMailSender.send(message);
    }

    private void sendHtmlMail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new IllegalStateException("메일 전송 실패", e);
        }
    }
}
