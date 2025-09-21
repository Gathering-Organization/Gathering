// package com.Gathering_be.service;

// import com.Gathering_be.domain.Notification;
// import com.Gathering_be.domain.Profile;
// import com.Gathering_be.dto.response.NotificationResponse;
// import com.Gathering_be.exception.NotificationNotFoundException;
// import com.Gathering_be.exception.ProfileNotFoundException;
// import com.Gathering_be.exception.UnauthorizedAccessException;
// import com.Gathering_be.repository.NotificationRepository;
// import com.Gathering_be.repository.ProfileRepository;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;
// import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

// import java.io.IOException;
// import java.util.List;
// import java.util.Map;
// import java.util.concurrent.ConcurrentHashMap;
// import java.util.stream.Collectors;

// @Slf4j
// @Service
// @RequiredArgsConstructor
// public class NotificationService {
//     private static final Long SSE_TIMEOUT = 1800L * 1000; // 30분
//     private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();
//     private final NotificationRepository notificationRepository;
//     private final ProfileRepository profileRepository;

//     public SseEmitter subscribe(String nickname) {
//         Long currentUserId = getCurrentUserId();
        
//         validateMemberAccess(currentUserId, nickname);

//         log.info("SSE subscription started for, nickname: {}", nickname);
//         SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
//         emitters.put(nickname, emitter);

//         // [로그 추가] Emitter가 성공적으로 저장되었음을 기록합니다.
//         log.info("New Emitter added for profileId: {}. Total emitters: {}", nickname, emitters.size());

//         // Emitter의 생명주기(완료, 타임아웃, 에러) 이벤트를 처리합니다.
//         emitter.onCompletion(() -> {
//             emitters.remove(nickname);
//             // [로그 추가] 연결 완료 시 Emitter 제거를 기록합니다.
//             log.info("Emitter removed for profileId: {} on completion. Total emitters: {}", nickname, emitters.size());
//         });
//         emitter.onTimeout(() -> {
//             emitters.remove(nickname);
//             // [로그 추가] 타임아웃 발생 시 Emitter 제거를 기록합니다.
//             log.warn("Emitter removed for profileId: {} on timeout. Total emitters: {}", nickname, emitters.size());
//         });
//         emitter.onError(e -> {
//             emitters.remove(nickname);
//             // [로그 추가] 에러 발생 시 Emitter 제거를 기록합니다.
//             log.error("Emitter removed for profileId: {} on error.", nickname, e);
//         });

//         // 연결 수립을 알리는 최초의 더미 데이터를 전송합니다.
//         sendToClient(emitter, nickname, "connect", "SSE connection established.");
//         return emitter;
//     }

//     public void send(Notification notification) {
//         String receiverNickname = notification.getReceiver().getNickname();

//         // SseEmitter가 존재하는지 확인
//         if (emitters.containsKey(receiverNickname)) {
//             SseEmitter emitter = emitters.get(receiverNickname);
//             NotificationResponse response = NotificationResponse.from(notification);

//             // 실제 데이터를 보내기 직전에 로그를 남깁니다.
//             log.info(">>>>>> Sending notification to profileId: {}, Data: {}", receiverNickname, response.getContent());

//             sendToClient(emitter, receiverNickname, "notification", response);
//         } else {
//             // Emitter가 없어서 보내지 못하는 경우도 로그로 남기면 디버깅에 좋습니다.
//             log.warn(">>>>>> No active SSE emitter found for profileId: {}. Notification not sent in real-time.", receiverNickname);
//         }
//     }

//     @Transactional(readOnly = true)
//     public List<NotificationResponse> getNotifications(String nickname) {
//         Long currentUserId = getCurrentUserId();
//         validateMemberAccess(currentUserId, nickname);

//         Long profileId = getProfileByNickname(nickname).getId();
//         List<Notification> notifications = notificationRepository.findAllByReceiverIdOrderByCreatedAtDesc(profileId);
//         return notifications.stream()
//                 .map(NotificationResponse::from)
//                 .collect(Collectors.toList());
//     }

//     @Transactional(readOnly = true)
//     public long getUnreadNotificationCount(String nickname) {
//         Long currentUserId = getCurrentUserId();
//         validateMemberAccess(currentUserId, nickname);

//         Long profileId = getProfileByNickname(nickname).getId();
//         return notificationRepository.countByReceiverIdAndIsReadFalse(profileId);
//     }

//     @Transactional
//     public void markAsRead(String nickname, Long notificationId) {
//         Long currentUserId = getCurrentUserId();
//         validateMemberAccess(currentUserId, nickname);

//         Notification notification = notificationRepository.findById(notificationId)
//                 .orElseThrow(NotificationNotFoundException::new);
//         notification.markAsRead();
//     }

//     @Transactional
//     public void markAllAsRead(String nickname) {
//         Long currentUserId = getCurrentUserId();
//         validateMemberAccess(currentUserId, nickname);

//         Long profileId = getProfileByNickname(nickname).getId();
//         notificationRepository.markAllAsReadByReceiverId(profileId);
//     }

//     private void validateMemberAccess(Long currentUserId, String nickname) {
//         Profile profile = profileRepository.findByMemberId(currentUserId)
//                 .orElseThrow(ProfileNotFoundException::new);
//         if (!profile.getNickname().equals(nickname)) {
//             throw new UnauthorizedAccessException();
//         }
//     }

//     private Long getCurrentUserId() {
//         String principal = SecurityContextHolder.getContext().getAuthentication().getName();
//         if ("anonymousUser".equals(principal)) {
//             return null;
//         }
//         return Long.parseLong(principal);
//     }

//     private Profile getProfileByNickname(String nickname) {
//         return profileRepository.findByNickname(nickname)
//                 .orElseThrow(ProfileNotFoundException::new);
//     }

//     private void sendToClient(SseEmitter emitter, String nickname, String eventName, Object data) {
//         try {
//             emitter.send(SseEmitter.event()
//                     .id(nickname + "_" + System.currentTimeMillis())
//                     .name(eventName)
//                     .data(data));
//         } catch (IOException e) {
//             emitters.remove(nickname);
//             log.error("Failed to send event to user {}: {}", nickname, e.getMessage());
//         }
//     }
// }

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
import java.util.concurrent.*;

import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {
    private static final Long SSE_TIMEOUT = 1800L * 1000; // 30분
    private static final Long HEARTBEAT_INTERVAL = 15L; // 15초마다 하트비트

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();
    private final NotificationRepository notificationRepository;
    private final ProfileRepository profileRepository;

    // 하트비트 스케줄러 (애플리케이션 시작 시 실행)
    private final ScheduledExecutorService heartbeatExecutor = Executors.newSingleThreadScheduledExecutor();

    {
        // 주기적으로 하트비트 전송
        heartbeatExecutor.scheduleAtFixedRate(() -> {
            for (Map.Entry<String, SseEmitter> entry : emitters.entrySet()) {
                String nickname = entry.getKey();
                SseEmitter emitter = entry.getValue();
                try {
                    emitter.send(SseEmitter.event()
                            .name("heartbeat")
                            .data("keep-alive"));
                    log.debug("Heartbeat sent to {}", nickname);
                } catch (IOException e) {
                    emitters.remove(nickname);
                    log.warn("Heartbeat failed, emitter removed for {}", nickname);
                }
            }
        }, HEARTBEAT_INTERVAL, HEARTBEAT_INTERVAL, TimeUnit.SECONDS);
    }

    public SseEmitter subscribe(String nickname) {
        Long currentUserId = getCurrentUserId();
        validateMemberAccess(currentUserId, nickname);

        log.info("SSE subscription started for nickname: {}", nickname);

        // 기존 emitter 있으면 강제 종료 후 제거
        if (emitters.containsKey(nickname)) {
            try {
                emitters.get(nickname).complete();
                log.info("Old emitter for {} completed before new subscription", nickname);
            } catch (Exception ignored) {}
            emitters.remove(nickname);
        }

        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
        emitters.put(nickname, emitter);

        log.info("New Emitter added for nickname: {}. Total emitters: {}", nickname, emitters.size());

        // Emitter의 생명주기 관리
        emitter.onCompletion(() -> {
            emitters.remove(nickname);
            log.info("Emitter removed for {} on completion. Total emitters: {}", nickname, emitters.size());
        });
        emitter.onTimeout(() -> {
            emitters.remove(nickname);
            log.warn("Emitter removed for {} on timeout. Total emitters: {}", nickname, emitters.size());
        });
        emitter.onError(e -> {
            emitters.remove(nickname);
            log.error("Emitter removed for {} on error: {}", nickname, e.getMessage());
        });

        // 최초 연결 알림
        sendToClient(emitter, nickname, "connect", "SSE connection established.");
        return emitter;
    }

    public void send(Notification notification) {
        String receiverNickname = notification.getReceiver().getNickname();

        if (emitters.containsKey(receiverNickname)) {
            SseEmitter emitter = emitters.get(receiverNickname);
            NotificationResponse response = NotificationResponse.from(notification);

            log.info(">>>>>> Sending notification to nickname: {}, Data: {}", receiverNickname, response.getContent());
            sendToClient(emitter, receiverNickname, "notification", response);
        } else {
            log.warn(">>>>>> No active SSE emitter found for nickname: {}. Notification not sent in real-time.", receiverNickname);
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

    private void sendToClient(SseEmitter emitter, String nickname, String eventName, Object data) {
        try {
            emitter.send(SseEmitter.event()
                    .id(nickname + "_" + System.currentTimeMillis())
                    .name(eventName)
                    .data(data));
        } catch (IOException e) {
            emitters.remove(nickname);
            log.error("Failed to send event to user {}: {}", nickname, e.getMessage());
        }
    }
}
