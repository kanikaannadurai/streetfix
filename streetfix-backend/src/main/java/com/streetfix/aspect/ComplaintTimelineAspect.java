package com.streetfix.aspect;

import com.streetfix.dto.ComplaintResponse;
import com.streetfix.enums.ComplaintStatus;
import com.streetfix.service.ComplaintTimelineService;
import com.streetfix.service.SlaService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

/**
 * AOP Aspect that intercepts ComplaintService method calls and automatically:
 *   1. Adds timeline entries whenever a complaint is created or its status changes.
 *   2. Initialises the SLA record whenever a new complaint is created.
 *
 * This allows Phase 1 features to integrate with the existing code
 * WITHOUT modifying ComplaintServiceImpl.
 */
@Aspect
@Component
public class ComplaintTimelineAspect {

    private final ComplaintTimelineService timelineService;
    private final SlaService slaService;

    public ComplaintTimelineAspect(ComplaintTimelineService timelineService, SlaService slaService) {
        this.timelineService = timelineService;
        this.slaService = slaService;
    }

    /**
     * Fires after a new complaint is successfully created.
     * Creates the initial PENDING timeline entry and initialises the SLA timer.
     */
    @AfterReturning(
        pointcut = "execution(* com.streetfix.service.ComplaintService.createComplaint(..))",
        returning = "response"
    )
    public void afterComplaintCreated(JoinPoint joinPoint, Object response) {
        if (response instanceof ComplaintResponse complaintResponse) {
            Long id = complaintResponse.getId();
            try {
                // Timeline: complaint submitted
                timelineService.addTimelineEntry(
                        id,
                        ComplaintStatus.PENDING,
                        "Complaint submitted by citizen",
                        "CITIZEN"
                );
                // SLA: initialise timer
                slaService.initializeSla(id);
            } catch (Exception e) {
                // Log but never break the original complaint creation flow
                System.err.println("[TimelineAspect] Error after createComplaint: " + e.getMessage());
            }
        }
    }

    /**
     * Fires after complaint status is updated.
     * Creates a timeline entry reflecting the new status.
     */
    @AfterReturning(
        pointcut = "execution(* com.streetfix.service.ComplaintService.updateStatus(..))",
        returning = "response"
    )
    public void afterStatusUpdated(JoinPoint joinPoint, Object response) {
        if (response instanceof ComplaintResponse complaintResponse) {
            Long id = complaintResponse.getId();
            ComplaintStatus newStatus = complaintResponse.getStatus();
            try {
                String message = buildStatusMessage(newStatus);
                timelineService.addTimelineEntry(id, newStatus, message, "SYSTEM");

                // If complaint reaches RESOLVED or CLOSED, resolve the SLA
                if (newStatus == ComplaintStatus.RESOLVED || newStatus == ComplaintStatus.CLOSED) {
                    slaService.resolveSla(id);
                }
            } catch (Exception e) {
                System.err.println("[TimelineAspect] Error after updateStatus: " + e.getMessage());
            }
        }
    }

    private String buildStatusMessage(ComplaintStatus status) {
        return switch (status) {
            case ASSIGNED             -> "Complaint assigned to officer for review";
            case ACCEPTED             -> "Officer accepted and will begin work";
            case IN_PROGRESS          -> "Field worker started working on the complaint";
            case RESOLVED             -> "Work completed by field team. Awaiting citizen verification";
            case CITIZEN_VERIFICATION -> "Sent to citizen for work verification";
            case CLOSED               -> "Complaint closed after citizen verification and feedback";
            default                   -> "Status updated to " + status.name();
        };
    }
}
