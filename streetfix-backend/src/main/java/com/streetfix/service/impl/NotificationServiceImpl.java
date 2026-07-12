package com.streetfix.service.impl;

import com.streetfix.entity.Notification;
import com.streetfix.entity.User;
import com.streetfix.repository.NotificationRepository;
import com.streetfix.repository.UserRepository;
import com.streetfix.service.NotificationService;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final com.streetfix.service.EmailNotificationService emailNotificationService;
    private final com.streetfix.service.SmsNotificationService smsNotificationService;

    public NotificationServiceImpl(NotificationRepository notificationRepository, 
                                   UserRepository userRepository,
                                   com.streetfix.service.EmailNotificationService emailNotificationService,
                                   com.streetfix.service.SmsNotificationService smsNotificationService) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.emailNotificationService = emailNotificationService;
        this.smsNotificationService = smsNotificationService;
    }

    @Override
    public void createNotificationForUser(Long receiverId, String receiverRole, Long complaintId, String title, String message) {
        log.info("DEBUG_NOTIF: Notification creation started. Recipient user ID: {}, Recipient role: {}", receiverId, receiverRole);
        Notification notification = Notification.builder()
                .receiverId(receiverId)
                .receiverRole(receiverRole)
                .complaintId(complaintId)
                .title(title)
                .message(message)
                .isRead(false)
                .build();
        Notification saved = notificationRepository.save(notification);
        
        log.info("DEBUG_NOTIF: Notification saved successfully! ID: {}, Recipient User ID: {}, Recipient Role: {}, Complaint ID: {}", saved.getId(), receiverId, receiverRole, complaintId);

        // Optional: Trigger email/SMS if needed (not explicitly requested to remove, so keep it for receiver)
        User user = userRepository.findById(receiverId).orElse(null);
        if (user != null) {
            if (user.getEmail() != null) {
                emailNotificationService.sendEmail(user.getEmail(), title, message);
            }
            if (user.getPhone() != null) {
                smsNotificationService.sendSms(user.getPhone(), message);
            }
        }
    }

    @Override
    public void createNotificationForRole(com.streetfix.enums.Role role, Long complaintId, String title, String message) {
        List<User> users = userRepository.findByRole(role);
        for (User user : users) {
            createNotificationForUser(user.getId(), role.name(), complaintId, title, message);
        }
    }

    @Override
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByReceiverIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByReceiverIdAndIsReadFalse(userId);
    }

    @Override
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification != null && notification.getReceiverId().equals(userId)) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }

    @Override
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByReceiverIdAndIsReadFalse(userId);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    @Override
    public void sendNotification(Long userId, String message) {
        createNotificationForUser(userId, "SYSTEM", null, "System Alert", message);
    }
}
