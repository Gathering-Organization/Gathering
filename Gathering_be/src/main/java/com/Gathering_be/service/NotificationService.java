package com.Gathering_be.service;

import com.Gathering_be.domain.Notification;
import com.Gathering_be.domain.Profile;
import com.Gathering_be.dto.response.NotificationResponse;
import com.Gathering_be.exception.NotificationNotFoundException;
import com.Gathering_be.exception.ProfileNotFoundException;
import com.Gathering_be.exception.UnauthorizedAccessException;
import com.Gathering_be.repository.NotificationRepository;
import com.Gathering_be.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {
    private static final Long SSE_TIMEOUT = 1800L * 1000; // 30분
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();
    private final NotificationRepository notificationRepository;
    private final ProfileRepository profileRepository;

    public SseEmitter subscribe(String nickname) {
        Long currentUserId = getCurrentUserId();
        validateMemberAccess(currentUserId, nickname);

        Long profileId = getProfileByNickname(nickname).getId();
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);

        emitters.put(profileId, emitter);
        emitter.onCompletion(() -> emitters.remove(profileId));
        emitter.onTimeout(() -> emitters.remove(profileId));
        emitter.onError(e -> emitters.remove(profileId));

        sendToClient(emitter, profileId, "connect", "SSE connection established.");
        return emitter;
    }

    public void send(Notification notification) {
        Long receiverId = notification.getReceiver().getId();
        if (emitters.containsKey(receiverId)) {
            SseEmitter emitter = emitters.get(receiverId);
            NotificationResponse response = NotificationResponse.from(notification);
            sendToClient(emitter, receiverId, "notification", response);
        }
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications(String nickname) {
        Long currentUserId = getCurrentUserId();
        validateMemberAccess(currentUserId, nickname);

        Long profileId = getProfileByNickname(nickname).getId();
        List<Notification> notifications = notificationRepository.findAllByReceiverIdOrderByCreatedAtDesc(profileId);
        return notifications.stream()
                .map(NotificationResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadNotificationCount(String nickname) {
        Long currentUserId = getCurrentUserId();
        validateMemberAccess(currentUserId, nickname);

        Long profileId = getProfileByNickname(nickname).getId();
        return notificationRepository.countByReceiverIdAndIsReadFalse(profileId);
    }

    @Transactional
    public void markAsRead(String nickname, Long notificationId) {
        Long currentUserId = getCurrentUserId();
        validateMemberAccess(currentUserId, nickname);

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(NotificationNotFoundException::new);
        notification.markAsRead();
    }

    @Transactional
    public void markAllAsRead(String nickname) {
        Long currentUserId = getCurrentUserId();
        validateMemberAccess(currentUserId, nickname);

        Long profileId = getProfileByNickname(nickname).getId();
        notificationRepository.markAllAsReadByReceiverId(profileId);
    }

    private void validateMemberAccess(Long currentUserId, String nickname) {
        Profile profile = profileRepository.findByMemberId(currentUserId)
                .orElseThrow(ProfileNotFoundException::new);
        if (!profile.getNickname().equals(nickname)) {
            throw new UnauthorizedAccessException();
        }
    }

    private Long getCurrentUserId() {
        String principal = SecurityContextHolder.getContext().getAuthentication().getName();
        if ("anonymousUser".equals(principal)) {
            return null;
        }
        return Long.parseLong(principal);
    }

    private Profile getProfileByNickname(String nickname) {
        return profileRepository.findByNickname(nickname)
                .orElseThrow(ProfileNotFoundException::new);
    }

    private void sendToClient(SseEmitter emitter, Long profileId, String eventName, Object data) {
        try {
            emitter.send(SseEmitter.event()
                    .id(String.valueOf(profileId) + "_" + System.currentTimeMillis())
                    .name(eventName)
                    .data(data));
        } catch (IOException e) {
            emitters.remove(profileId);
            log.error("Failed to send event to user {}: {}", profileId, e.getMessage());
        }
    }
}
