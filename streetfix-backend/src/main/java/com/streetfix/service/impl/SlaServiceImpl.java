package com.streetfix.service.impl;

import com.streetfix.dto.SlaConfigRequest;
import com.streetfix.dto.SlaConfigResponse;
import com.streetfix.dto.ComplaintSlaResponse;
import com.streetfix.entity.Complaint;
import com.streetfix.entity.ComplaintSla;
import com.streetfix.entity.SlaConfig;
import com.streetfix.enums.EscalationLevel;
import com.streetfix.enums.SlaStatus;
import com.streetfix.repository.AssignmentRepository;
import com.streetfix.repository.ComplaintRepository;
import com.streetfix.repository.ComplaintSlaRepository;
import com.streetfix.repository.SlaConfigRepository;
import com.streetfix.service.DisciplinaryService;
import com.streetfix.service.SlaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.annotation.PostConstruct;

@Service
@Transactional
public class SlaServiceImpl implements SlaService {

    // Default SLA if no category-specific config exists (72 hours, warn at 24)
    private static final int DEFAULT_DURATION_HOURS = 72;
    private static final int DEFAULT_WARNING_HOURS  = 24;

    private final SlaConfigRepository slaConfigRepository;
    private final ComplaintSlaRepository complaintSlaRepository;
    private final ComplaintRepository complaintRepository;
    private final AssignmentRepository assignmentRepository;
    private final DisciplinaryService disciplinaryService;
    private final com.streetfix.service.NotificationService notificationService;

    public SlaServiceImpl(SlaConfigRepository slaConfigRepository,
                          ComplaintSlaRepository complaintSlaRepository,
                          ComplaintRepository complaintRepository,
                          AssignmentRepository assignmentRepository,
                          DisciplinaryService disciplinaryService,
                          com.streetfix.service.NotificationService notificationService) {
        this.slaConfigRepository = slaConfigRepository;
        this.complaintSlaRepository = complaintSlaRepository;
        this.complaintRepository = complaintRepository;
        this.assignmentRepository = assignmentRepository;
        this.disciplinaryService = disciplinaryService;
        this.notificationService = notificationService;
    }

    // ─────────────────────────── SLA CONFIG CRUD ───────────────────────────

    @PostConstruct
    public void initDefaultSlaConfigs() {
        if (slaConfigRepository.count() == 0) {
            List<String> categories = List.of("Pothole", "Garbage", "Water Leakage", "Street Light", "Drainage", "Sewage", "Other");
            for (String category : categories) {
                SlaConfig config = SlaConfig.builder()
                        .category(category)
                        .durationHours(DEFAULT_DURATION_HOURS)
                        .warningHours(DEFAULT_WARNING_HOURS)
                        .build();
                slaConfigRepository.save(config);
            }
        }
    }

    @Override
    public SlaConfigResponse createSlaConfig(SlaConfigRequest request) {
        if (slaConfigRepository.existsByCategory(request.getCategory())) {
            throw new RuntimeException("SLA config already exists for category: " + request.getCategory());
        }
        SlaConfig config = SlaConfig.builder()
                .category(request.getCategory())
                .durationHours(request.getDurationHours())
                .warningHours(request.getWarningHours())
                .build();
        return toSlaConfigResponse(slaConfigRepository.save(config));
    }

    @Override
    public SlaConfigResponse updateSlaConfig(Long id, SlaConfigRequest request) {
        SlaConfig config = slaConfigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SLA Config not found with id: " + id));
        config.setCategory(request.getCategory());
        config.setDurationHours(request.getDurationHours());
        config.setWarningHours(request.getWarningHours());
        return toSlaConfigResponse(slaConfigRepository.save(config));
    }

    @Override
    public void deleteSlaConfig(Long id) {
        slaConfigRepository.deleteById(id);
    }

    @Override
    public List<SlaConfigResponse> getAllSlaConfigs() {
        return slaConfigRepository.findAll()
                .stream().map(this::toSlaConfigResponse).collect(Collectors.toList());
    }

    @Override
    public SlaConfigResponse getSlaConfigByCategory(String category) {
        SlaConfig config = slaConfigRepository.findByCategory(category)
                .orElseThrow(() -> new RuntimeException("No SLA config found for category: " + category));
        return toSlaConfigResponse(config);
    }

    // ─────────────────────────── SLA TRACKING ──────────────────────────────

    @Override
    public ComplaintSlaResponse initializeSla(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found: " + complaintId));

        // Look up category-specific SLA, fall back to defaults
        int durationHours = slaConfigRepository.findByCategory(complaint.getCategory())
                .map(SlaConfig::getDurationHours)
                .orElse(DEFAULT_DURATION_HOURS);

        LocalDateTime dueDate = complaint.getCreatedAt() != null
                ? complaint.getCreatedAt().plusHours(durationHours)
                : LocalDateTime.now().plusHours(durationHours);

        ComplaintSla sla = ComplaintSla.builder()
                .complaint(complaint)
                .dueDate(dueDate)
                .status(SlaStatus.ACTIVE)
                .escalationLevel(EscalationLevel.LEVEL_0)
                .build();

        return toComplaintSlaResponse(complaintSlaRepository.save(sla));
    }

    @Override
    public ComplaintSlaResponse getSlаForComplaint(Long complaintId) {
        ComplaintSla sla = complaintSlaRepository.findByComplaintId(complaintId)
                .orElseThrow(() -> new RuntimeException("SLA not found for complaint: " + complaintId));
        return toComplaintSlaResponse(sla);
    }

    @Override
    public List<ComplaintSlaResponse> getBreachedSlas() {
        return complaintSlaRepository.findByStatus(SlaStatus.BREACHED)
                .stream().map(this::toComplaintSlaResponse).collect(Collectors.toList());
    }

    @Override
    public void resolveSla(Long complaintId) {
        complaintSlaRepository.findByComplaintId(complaintId).ifPresent(sla -> {
            sla.setStatus(SlaStatus.RESOLVED);
            complaintSlaRepository.save(sla);
        });
    }

    // ─────────────────────────── SCHEDULER TASK ────────────────────────────

    @Override
    public void checkAndUpdateSlaStatuses() {
        LocalDateTime now = LocalDateTime.now();

        // 1. Mark breached SLAs
        List<ComplaintSla> breached = complaintSlaRepository.findBreachedSlas(now);
        for (ComplaintSla sla : breached) {
            sla.setStatus(SlaStatus.BREACHED);
            complaintSlaRepository.save(sla);

            // Apply disciplinary action to the assigned officer
            assignmentRepository.findByComplaintId(sla.getComplaint().getId()).stream()
                .filter(assignment -> assignment.getOfficer() != null)
                .findFirst()
                .ifPresent(assignment -> {
                    disciplinaryService.applySlaViolationDiscipline(sla.getComplaint(), assignment.getOfficer());
                    notificationService.createNotificationForUser(assignment.getOfficer().getUser().getId(), assignment.getOfficer().getUser().getRole().name(), sla.getComplaint().getId(), "Your complaint SLA has expired", "SLA breached.");
                });
                
            notificationService.createNotificationForRole(com.streetfix.enums.Role.ROLE_ADMIN, sla.getComplaint().getId(), "SLA Breached for complaint: " + sla.getComplaint().getTitle(), "Immediate attention required.");
        }

        // 2. Mark warning SLAs (within 24-hour window, configurable per category)
        for (ComplaintSla sla : complaintSlaRepository.findByStatus(SlaStatus.ACTIVE)) {
            long warningHours = slaConfigRepository
                    .findByCategory(sla.getComplaint().getCategory())
                    .map(c -> (long) c.getWarningHours())
                    .orElse((long) DEFAULT_WARNING_HOURS);
            LocalDateTime warningThreshold = now.plusHours(warningHours);
            if (sla.getDueDate().isBefore(warningThreshold)) {
                sla.setStatus(SlaStatus.WARNING);
                complaintSlaRepository.save(sla);
            }
        }
    }

    // ─────────────────────────── MAPPERS ───────────────────────────────────

    private SlaConfigResponse toSlaConfigResponse(SlaConfig c) {
        return SlaConfigResponse.builder()
                .id(c.getId())
                .category(c.getCategory())
                .durationHours(c.getDurationHours())
                .warningHours(c.getWarningHours())
                .build();
    }

    private ComplaintSlaResponse toComplaintSlaResponse(ComplaintSla sla) {
        long remaining = ChronoUnit.HOURS.between(LocalDateTime.now(), sla.getDueDate());
        return ComplaintSlaResponse.builder()
                .id(sla.getId())
                .complaintId(sla.getComplaint().getId())
                .complaintTitle(sla.getComplaint().getTitle())
                .dueDate(sla.getDueDate())
                .status(sla.getStatus())
                .escalationLevel(sla.getEscalationLevel())
                .remainingHours(remaining)
                .isOverdue(remaining < 0)
                .createdAt(sla.getCreatedAt())
                .updatedAt(sla.getUpdatedAt())
                .build();
    }
}
