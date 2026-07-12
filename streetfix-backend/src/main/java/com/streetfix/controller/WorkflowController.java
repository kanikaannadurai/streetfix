package com.streetfix.controller;

import com.streetfix.dto.MessageResponse;
import com.streetfix.service.WorkflowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/workflow")
@RequiredArgsConstructor
public class WorkflowController {

    private final WorkflowService workflowService;

    @PostMapping("/{complaintId}/assign-ws")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> assignToWardSupervisor(
            @PathVariable Long complaintId,
            @RequestParam Long userId) {
        log.info("Assigning complaint {} to Ward Supervisor {}", complaintId, userId);
        return ResponseEntity.ok(workflowService.assignToWardSupervisor(complaintId, userId));
    }

    @PostMapping("/{complaintId}/assign-worker")
    @PreAuthorize("hasRole('WARD_SUPERVISOR') or hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> assignToWorker(
            @PathVariable Long complaintId,
            @RequestParam Long userId) {
        log.info("Assigning complaint {} to Worker {}", complaintId, userId);
        return ResponseEntity.ok(workflowService.assignToWorker(complaintId, userId));
    }

    @PostMapping("/{complaintId}/complete")
    @PreAuthorize("hasRole('WORKER') or hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> markWorkCompleted(@PathVariable Long complaintId) {
        log.info("Worker marked complaint {} as completed", complaintId);
        return ResponseEntity.ok(workflowService.markWorkCompleted(complaintId));
    }

    @PostMapping("/{complaintId}/verify-ws")
    @PreAuthorize("hasRole('WARD_SUPERVISOR') or hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> verifyByWardSupervisor(
            @PathVariable Long complaintId,
            @RequestParam boolean approved,
            @RequestParam(required = false, defaultValue = "") String remarks) {
        log.info("Ward Supervisor verifying complaint {}. Approved: {}", complaintId, approved);
        return ResponseEntity.ok(workflowService.verifyByWardSupervisor(complaintId, approved, remarks));
    }
}
