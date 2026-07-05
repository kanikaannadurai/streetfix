package com.streetfix.controller;

import com.streetfix.dto.MessageResponse;
import com.streetfix.dto.NotificationResponse;
import com.streetfix.entity.Notification;
import com.streetfix.repository.NotificationRepository;
import com.streetfix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    /**
     * Get all notifications for the currently logged-in user.
     */
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(Principal principal) {
        Long userId = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        List<NotificationResponse> notifications = notificationRepository.findByUserId(userId)
                .stream()
                .map(n -> NotificationResponse.builder()
                        .id(n.getId())
                        .message(n.getMessage())
                        .status(n.getStatus())
                        .createdAt(n.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(notifications);
    }

    /**
     * Get count of unread notifications.
     */
    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadCount(Principal principal) {
        Long userId = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        long count = notificationRepository.findByUserId(userId)
                .stream()
                .filter(n -> "UNREAD".equals(n.getStatus()))
                .count();

        return ResponseEntity.ok(count);
    }

    /**
     * Mark a specific notification as READ.
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<MessageResponse> markAsRead(@PathVariable Long id, Principal principal) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        // Ensure the notification belongs to the requesting user
        Long userId = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied: notification does not belong to you");
        }

        notification.setStatus("READ");
        notificationRepository.save(notification);
        return ResponseEntity.ok(new MessageResponse("Notification marked as read"));
    }

    /**
     * Mark ALL notifications as read for the current user.
     */
    @PutMapping("/read-all")
    public ResponseEntity<MessageResponse> markAllAsRead(Principal principal) {
        Long userId = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        List<Notification> unread = notificationRepository.findByUserId(userId)
                .stream()
                .filter(n -> "UNREAD".equals(n.getStatus()))
                .collect(Collectors.toList());

        unread.forEach(n -> n.setStatus("READ"));
        notificationRepository.saveAll(unread);

        return ResponseEntity.ok(new MessageResponse("All notifications marked as read"));
    }
}
