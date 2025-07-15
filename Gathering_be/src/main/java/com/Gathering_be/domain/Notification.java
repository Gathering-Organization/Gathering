package com.Gathering_be.domain;

import com.Gathering_be.global.common.BaseTimeEntity;
import com.Gathering_be.global.enums.NotificationType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Notification extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private Profile receiver;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private boolean isRead = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType notificationType;

    @Column(nullable = false)
    private String relatedUrl;

    @Builder
    public Notification(Profile receiver, String content, NotificationType notificationType, String relatedUrl) {
        this.receiver = receiver;
        this.content = content;
        this.notificationType = notificationType;
        this.relatedUrl = relatedUrl;
        this.isRead = false;
    }

    public void markAsRead() {
        this.isRead = true;
    }
}
