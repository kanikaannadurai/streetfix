package com.streetfix.service;

import com.streetfix.entity.Complaint;
import org.springframework.stereotype.Service;

/**
 * Handles emergency workflows for CRITICAL complaints.
 */
@Service
public class EmergencyComplaintService {

    private final EscalationService escalationService;
    private final NotificationService notificationService;

    public EmergencyComplaintService(EscalationService escalationService, NotificationService notificationService) {
        this.escalationService = escalationService;
        this.notificationService = notificationService;
    }

    /**
     * Triggered when a new CRITICAL complaint is created.
     */
    public void triggerEmergencyProtocol(Complaint complaint) {
        // Immediate escalation to top level
        escalationService.escalateComplaint(complaint.getId(), "EMERGENCY PROTOCOL TRIGGERED: Critical priority complaint created.");
        
        // The escalation service already handles notifying the escalated role,
        // but we might want to specifically notify all SUPER_ADMINs as well.
        notificationService.sendNotification(1L, "EMERGENCY: Critical complaint #" + complaint.getId() + " - " + complaint.getTitle());
    }
}
