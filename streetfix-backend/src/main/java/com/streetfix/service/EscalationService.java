package com.streetfix.service;

import com.streetfix.dto.EscalationLogResponse;

import java.util.List;

public interface EscalationService {

    /** Trigger escalation for a specific complaint to the next level */
    void escalateComplaint(Long complaintId, String reason);

    /** Get full escalation history for a complaint */
    List<EscalationLogResponse> getEscalationHistory(Long complaintId);

    /** Get all escalated complaints (admin/supervisor view) */
    List<EscalationLogResponse> getAllEscalations();

    /** Scheduler-callable: check all active complaints and escalate if thresholds met */
    void checkAndEscalateComplaints();
}
