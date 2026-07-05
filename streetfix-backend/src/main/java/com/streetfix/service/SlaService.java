package com.streetfix.service;

import com.streetfix.dto.SlaConfigRequest;
import com.streetfix.dto.SlaConfigResponse;
import com.streetfix.dto.ComplaintSlaResponse;

import java.util.List;

public interface SlaService {

    // ── SLA Config Management (Admin) ──────────────────────────────────
    SlaConfigResponse createSlaConfig(SlaConfigRequest request);
    SlaConfigResponse updateSlaConfig(Long id, SlaConfigRequest request);
    void deleteSlaConfig(Long id);
    List<SlaConfigResponse> getAllSlaConfigs();
    SlaConfigResponse getSlaConfigByCategory(String category);

    // ── SLA Tracking ───────────────────────────────────────────────────
    /** Called when a complaint is created – initialises the SLA record */
    ComplaintSlaResponse initializeSla(Long complaintId);

    /** Get current SLA status for a specific complaint */
    ComplaintSlaResponse getSlаForComplaint(Long complaintId);

    /** Get all complaints with breached SLAs */
    List<ComplaintSlaResponse> getBreachedSlas();

    /** Mark SLA as RESOLVED when complaint is closed */
    void resolveSla(Long complaintId);

    // ── Scheduler-callable methods ────────────────────────────────────
    /** Run SLA breach check across all active SLAs */
    void checkAndUpdateSlaStatuses();
}
