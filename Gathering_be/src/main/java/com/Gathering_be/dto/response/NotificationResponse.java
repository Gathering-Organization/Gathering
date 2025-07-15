package com.Gathering_be.dto.response;

import com.Gathering_be.domain.Notification;
import com.Gathering_be.global.enums.NotificationType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class NotificationResponse {
    private Long id;
    private String content;
    private boolean isRead;
    private NotificationType notificationType;
    private String relatedUrl;
    private LocalDateTime createdAt;

    public static NotificationResponse from(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .content(notification.getContent())
                .isRead(notification.isRead())
                .notificationType(notification.getNotificationType())
                .relatedUrl(notification.getRelatedUrl())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
