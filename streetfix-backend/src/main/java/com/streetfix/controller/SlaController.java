package com.streetfix.controller;

import com.streetfix.dto.ComplaintSlaResponse;
import com.streetfix.dto.MessageResponse;
import com.streetfix.dto.SlaConfigRequest;
import com.streetfix.dto.SlaConfigResponse;
import com.streetfix.service.SlaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for SLA management.
 *
 * Admin endpoints: /api/sla/config/**
 * Complaint SLA endpoints: /api/sla/complaints/**
 */
@RestController
@RequestMapping("/api/sla")
@RequiredArgsConstructor
public class SlaController {

    private final SlaService slaService;

    // ── SLA Configuration (Admin only) ─────────────────────────────────────

    @PostMapping("/config")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<SlaConfigResponse> createSlaConfig(@Valid @RequestBody SlaConfigRequest request) {
        return ResponseEntity.ok(slaService.createSlaConfig(request));
    }

    @PutMapping("/config/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<SlaConfigResponse> updateSlaConfig(@PathVariable Long id,
                                                              @Valid @RequestBody SlaConfigRequest request) {
        return ResponseEntity.ok(slaService.updateSlaConfig(id, request));
    }

    @DeleteMapping("/config/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<MessageResponse> deleteSlaConfig(@PathVariable Long id) {
        slaService.deleteSlaConfig(id);
        return ResponseEntity.ok(new MessageResponse("SLA config deleted successfully"));
    }

    @GetMapping("/config")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<SlaConfigResponse>> getAllSlaConfigs() {
        return ResponseEntity.ok(slaService.getAllSlaConfigs());
    }

    @GetMapping("/config/category/{category}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<SlaConfigResponse> getSlaConfigByCategory(@PathVariable String category) {
        return ResponseEntity.ok(slaService.getSlaConfigByCategory(category));
    }

    // ── SLA Status for Complaints ──────────────────────────────────────────

    @GetMapping("/complaints/{complaintId}")
    public ResponseEntity<ComplaintSlaResponse> getSlaForComplaint(@PathVariable Long complaintId) {
        return ResponseEntity.ok(slaService.getSlаForComplaint(complaintId));
    }

    @GetMapping("/complaints/breached")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER') or hasRole('WARD_SUPERVISOR') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<ComplaintSlaResponse>> getBreachedSlas() {
        return ResponseEntity.ok(slaService.getBreachedSlas());
    }
}
