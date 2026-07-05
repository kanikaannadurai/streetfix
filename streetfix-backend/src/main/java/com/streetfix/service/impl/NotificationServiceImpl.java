package com.streetfix.service.impl;

import com.streetfix.entity.Notification;
import com.streetfix.entity.User;
import com.streetfix.repository.NotificationRepository;
import com.streetfix.repository.UserRepository;
import com.streetfix.service.NotificationService;
import org.springframework.stereotype.Service;

@Service
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
    public void sendNotification(Long userId, String message) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            Notification notification = Notification.builder()
                    .user(user)
                    .message(message)
                    .status("UNREAD")
                    .build();
            notificationRepository.save(notification);

            // Phase 5: Trigger Email and SMS integrations
            if (user.getEmail() != null) {
                emailNotificationService.sendEmail(user.getEmail(), "StreetFix Notification", message);
            }
            if (user.getPhone() != null) {
                smsNotificationService.sendSms(user.getPhone(), message);
            }
        }
    }
}
