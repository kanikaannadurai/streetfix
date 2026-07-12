package com.streetfix.controller;

import com.streetfix.dto.MessageResponse;
import com.streetfix.dto.NotificationResponse;
import com.streetfix.entity.Notification;
import com.streetfix.repository.NotificationRepository;
import com.streetfix.repository.UserRepository;
import com.streetfix.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * REST controller for in-app notifications.
 *
 * Exposes previously-missing endpoints to fetch and manage
 * notifications for the logged-in user.
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    private Long getLoggedInUserId(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(Principal principal) {
        Long userId = getLoggedInUserId(principal);
        List<Notification> notifications = notificationService.getUserNotifications(userId);
        log.info("DEBUG_NOTIF: Notification fetched! User ID: {}, Count: {}", userId, notifications.size());
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(Principal principal) {
        return ResponseEntity.ok(notificationService.getUnreadCount(getLoggedInUserId(principal)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<MessageResponse> markAsRead(@PathVariable Long id, Principal principal) {
        notificationService.markAsRead(id, getLoggedInUserId(principal));
        return ResponseEntity.ok(new MessageResponse("Notification marked as read"));
    }

    @PutMapping("/read-all")
    public ResponseEntity<MessageResponse> markAllAsRead(Principal principal) {
        notificationService.markAllAsRead(getLoggedInUserId(principal));
        return ResponseEntity.ok(new MessageResponse("All notifications marked as read"));
    }
}
