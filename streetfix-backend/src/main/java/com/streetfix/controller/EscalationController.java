package com.streetfix.controller;

import com.streetfix.dto.EscalationLogResponse;
import com.streetfix.dto.MessageResponse;
import com.streetfix.service.EscalationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for the escalation system.
 *
 * Allows supervisors and admins to view escalation history
 * and manually trigger escalation when needed.
 */
@RestController
@RequestMapping("/api/escalations")
@RequiredArgsConstructor
public class EscalationController {

    private final EscalationService escalationService;

    /**
     * Manually escalate a complaint (Admin/Supervisor).
     * Auto-escalation also runs via the scheduler.
     */
    @PostMapping("/complaints/{complaintId}/escalate")
    @PreAuthorize("hasRole('ADMIN') or hasRole('WARD_SUPERVISOR') or hasRole('ZONAL_OFFICER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<MessageResponse> escalateComplaint(
            @PathVariable Long complaintId,
            @RequestParam(defaultValue = "Manually escalated by supervisor") String reason) {
        escalationService.escalateComplaint(complaintId, reason);
        return ResponseEntity.ok(new MessageResponse("Complaint escalated successfully"));
    }

    /**
     * Get escalation history for a specific complaint.
     */
    @GetMapping("/complaints/{complaintId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER') or hasRole('WARD_SUPERVISOR') " +
                  "or hasRole('ZONAL_OFFICER') or hasRole('MUNICIPAL_COMMISSIONER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<EscalationLogResponse>> getEscalationHistory(@PathVariable Long complaintId) {
        return ResponseEntity.ok(escalationService.getEscalationHistory(complaintId));
    }

    /**
     * Get all escalation logs across the system (admin/supervisor view).
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('WARD_SUPERVISOR') or hasRole('ZONAL_OFFICER') " +
                  "or hasRole('MUNICIPAL_COMMISSIONER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<EscalationLogResponse>> getAllEscalations() {
        return ResponseEntity.ok(escalationService.getAllEscalations());
    }
}
