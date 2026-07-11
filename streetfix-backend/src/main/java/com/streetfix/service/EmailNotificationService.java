package com.streetfix.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailNotificationService {

    public EmailNotificationService() {
        log.info("[EMAIL] Mail service disabled - no SMTP configured");
    }

    public void sendEmail(String to, String subject, String body) {
        log.info("[EMAIL DISABLED] To: {} | Subject: {} | Body: {}", to, subject, body);
    }

    public void sendComplaintCreatedEmail(String to, String complaintId) {
        log.info("[EMAIL DISABLED] Complaint created: {}", complaintId);
    }

    public void sendStatusUpdateEmail(String to, String complaintId, String status) {
        log.info("[EMAIL DISABLED] Status update: {} -> {}", complaintId, status);
    }

    public void sendEscalationEmail(String to, String complaintId, String level) {
        log.info("[EMAIL DISABLED] Escalation: {} level: {}", complaintId, level);
    }

    public void sendReminderEmail(String to, String complaintId) {
        log.info("[EMAIL DISABLED] Reminder: {}", complaintId);
    }
}