package com.streetfix.scheduler;

import com.streetfix.service.EscalationService;
import com.streetfix.service.SlaService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Background scheduler for SLA monitoring and automatic escalation.
 *
 * Runs on a fixed schedule to:
 *  - Detect SLA breaches and mark them BREACHED / WARNING
 *  - Auto-escalate unresolved complaints per the escalation_config thresholds
 */
@Component
public class SlaEscalationScheduler {

    private final SlaService slaService;
    private final EscalationService escalationService;

    public SlaEscalationScheduler(SlaService slaService, EscalationService escalationService) {
        this.slaService = slaService;
        this.escalationService = escalationService;
    }

    /**
     * SLA breach check – runs every 30 minutes.
     * Marks active SLAs as WARNING or BREACHED based on current time vs due date.
     */
    @Scheduled(fixedDelay = 1_800_000) // 30 minutes
    public void checkSlaStatuses() {
        try {
            System.out.println("[SLA Scheduler] Running SLA status check...");
            slaService.checkAndUpdateSlaStatuses();
            System.out.println("[SLA Scheduler] SLA status check complete.");
        } catch (Exception e) {
            System.err.println("[SLA Scheduler] Error during SLA check: " + e.getMessage());
        }
    }

    /**
     * Escalation check – runs every hour.
     * Escalates complaints that have crossed time-based thresholds
     * (3 days → reminder, 7 days → Ward Supervisor, 15 days → Commissioner).
     */
    @Scheduled(fixedDelay = 3_600_000) // 1 hour
    public void checkEscalations() {
        try {
            System.out.println("[Escalation Scheduler] Running escalation check...");
            escalationService.checkAndEscalateComplaints();
            System.out.println("[Escalation Scheduler] Escalation check complete.");
        } catch (Exception e) {
            System.err.println("[Escalation Scheduler] Error during escalation check: " + e.getMessage());
        }
    }
}
