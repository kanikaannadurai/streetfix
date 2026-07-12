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

                // If complaint reaches RESOLVED, resolve the SLA
                if (newStatus == ComplaintStatus.RESOLVED) {
                    slaService.resolveSla(id);
                }
            } catch (Exception e) {
                System.err.println("[TimelineAspect] Error after updateStatus: " + e.getMessage());
            }
        }
    }

    private String buildStatusMessage(ComplaintStatus status) {
        return switch (status) {
            case ASSIGNED_TO_ZONAL_OFFICER             -> "Complaint assigned to zonal officer";
            case ASSIGNED_TO_ASSISTANT_COMMISSIONER    -> "Complaint assigned to assistant commissioner";
            case ASSIGNED_TO_WARD_SUPERVISOR           -> "Complaint assigned to ward supervisor";
            case ASSIGNED_TO_WORKER                    -> "Complaint assigned to field worker";
            case WORK_COMPLETED                        -> "Work completed by field team. Awaiting verification";
            case VERIFIED_BY_WARD_SUPERVISOR           -> "Verified by ward supervisor";
            case APPROVED_BY_ASSISTANT_COMMISSIONER    -> "Approved by assistant commissioner";
            case APPROVED_BY_ZONAL_OFFICER             -> "Approved by zonal officer";
            case RESOLVED                              -> "Complaint resolved";
            default                   -> "Status updated to " + status.name();
        };
    }
}
