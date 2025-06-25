package com.Gathering_be.service;

import com.Gathering_be.exception.EmailSendFailedException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.List;

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

    public void sendCloseMailToAuthor(String to, String projectTitle, String authorName) {
        Context context = new Context();
        context.setVariable("projectTitle", projectTitle);
        context.setVariable("authorName", authorName);
        context.setVariable("link", "https://www.naver.com");

        String htmlContent = templateEngine.process("deadline_author", context);
        String subject = "[Gathering] 프로젝트 마감 안내";

        sendHtmlMail(to, subject, htmlContent);
    }

    public void sendCloseMailToApplicant(String to, String projectTitle, String applicantName) {
        Context context = new Context();
        context.setVariable("projectTitle", projectTitle);
        context.setVariable("applicantName", applicantName);
        context.setVariable("link", "https://www.naver.com");

        String htmlContent = templateEngine.process("deadline_applicant", context);
        String subject = "[Gathering] 지원 프로젝트 마감 안내";

        sendHtmlMail(to, subject, htmlContent);
    }

    public void sendNewApplyMail(String to, String projectTitle, String authorName) {
        Context context = new Context();
        context.setVariable("projectTitle", projectTitle);
        context.setVariable("authorName", authorName);
        context.setVariable("link", "https://www.naver.com");

        String htmlContent = templateEngine.process("notify", context);
        String subject = "[Gathering] 새 지원서가 도착했습니다!";

        sendHtmlMail(to, subject, htmlContent);
    }

    public void sendProjectDeletionNotice(List<String> recipients) {
        Context context = new Context();
        //context.setVariable("projectTitle", projectTitle);
        //context.setVariable("authorName", authorName);
        context.setVariable("link", "https://www.gathering.work");

        String htmlContent = templateEngine.process("notify", context);
        String subject = "[Gathering] 삭제";

        for (String to : recipients) {
            sendHtmlMail(to, subject, htmlContent);
        }
    }

    private void sendHtmlMail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            javaMailSender.send(message);
        } catch (MessagingException | MailException e) {
            throw new EmailSendFailedException();
        }
    }
}
