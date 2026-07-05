package com.streetfix.service;

import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    public EmailNotificationService() {
        System.out.println("[EMAIL] Mail service disabled - no SMTP configured");
    }

    public void sendEmail(String to, String subject, String body) {
        System.out.println("[EMAIL DISABLED] To: " + to + " | Subject: " + subject);
    }

    public void sendComplaintCreatedEmail(String to, String complaintId) {
        System.out.println("[EMAIL DISABLED] Complaint created: " + complaintId);
    }

    public void sendStatusUpdateEmail(String to, String complaintId, String status) {
        System.out.println("[EMAIL DISABLED] Status update: " + complaintId + " -> " + status);
    }

    public void sendEscalationEmail(String to, String complaintId, String level) {
        System.out.println("[EMAIL DISABLED] Escalation: " + complaintId + " level: " + level);
    }

    public void sendReminderEmail(String to, String complaintId) {
        System.out.println("[EMAIL DISABLED] Reminder: " + complaintId);
    }
}