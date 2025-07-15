package com.Gathering_be.controller;

import com.Gathering_be.dto.response.NotificationResponse;
import com.Gathering_be.global.response.ResultCode;
import com.Gathering_be.global.response.ResultResponse;
import com.Gathering_be.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    // SSE 연결 요청
    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> subscribe(@RequestParam String nickname) {
        return ResponseEntity.ok(notificationService.subscribe(nickname));
    }

    // 현재 사용자의 모든 알림 목록 조회
    @GetMapping
    public ResultResponse getNotifications(@RequestParam String nickname) {
        List<NotificationResponse> notifications = notificationService.getNotifications(nickname);
        return ResultResponse.of(ResultCode.NOTIFICATION_READ_SUCCESS, notifications);
    }

    // 읽지 않은 알림 개수 조회
    @GetMapping("/unread-count")
    public ResultResponse getUnreadNotificationCount(@RequestParam String nickname) {
        Long count = notificationService.getUnreadNotificationCount(nickname);
        return ResultResponse.of(ResultCode.NOTIFICATION_COUNT_GET_SUCCESS, count);
    }

    // 특정 알림 읽음 처리
    @PatchMapping("/{notificationId}/read")
    public ResultResponse markAsRead(@RequestParam String nickname, @PathVariable Long notificationId) {
        notificationService.markAsRead(nickname, notificationId);
        return ResultResponse.of(ResultCode.NOTIFICATION_MARK_AS_READ_SUCCESS);
    }

    // 모든 알림 읽음 처리
    @PatchMapping("/read-all")
    public ResultResponse markAllAsRead(@RequestParam String nickname) {
        notificationService.markAllAsRead(nickname);
        return ResultResponse.of(ResultCode.NOTIFICATION_MARK_ALL_AS_READ_SUCCESS);
    }
}
