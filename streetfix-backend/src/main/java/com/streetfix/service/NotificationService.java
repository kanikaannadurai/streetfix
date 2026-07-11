package com.streetfix.service;

import com.streetfix.entity.Notification;
import com.streetfix.enums.Role;

import java.util.List;

public interface NotificationService {
    void createNotificationForUser(Long receiverId, String receiverRole, Long complaintId, String title, String message);
    void createNotificationForRole(Role role, Long complaintId, String title, String message);
    List<Notification> getUserNotifications(Long userId);
    long getUnreadCount(Long userId);
    void markAsRead(Long notificationId, Long userId);
    void markAllAsRead(Long userId);
}
