package com.streetfix.service.impl;

import com.streetfix.dto.EscalationLogResponse;
import com.streetfix.entity.Complaint;
import com.streetfix.entity.ComplaintSla;
import com.streetfix.entity.EscalationConfig;
import com.streetfix.entity.EscalationLog;
import com.streetfix.enums.EscalationLevel;
import com.streetfix.repository.ComplaintRepository;
import com.streetfix.repository.ComplaintSlaRepository;
import com.streetfix.repository.EscalationConfigRepository;
import com.streetfix.repository.EscalationLogRepository;
import com.streetfix.repository.UserRepository;
import com.streetfix.service.EscalationService;
import com.streetfix.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class EscalationServiceImpl implements EscalationService {

    private final ComplaintSlaRepository complaintSlaRepository;
    private final EscalationLogRepository escalationLogRepository;
    private final EscalationConfigRepository escalationConfigRepository;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public EscalationServiceImpl(ComplaintSlaRepository complaintSlaRepository,
                                  EscalationLogRepository escalationLogRepository,
                                  EscalationConfigRepository escalationConfigRepository,
                                  ComplaintRepository complaintRepository,
                                  UserRepository userRepository,
                                  NotificationService notificationService) {
        this.complaintSlaRepository = complaintSlaRepository;
        this.escalationLogRepository = escalationLogRepository;
        this.escalationConfigRepository = escalationConfigRepository;
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Override
    public void escalateComplaint(Long complaintId, String reason) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found: " + complaintId));

        ComplaintSla sla = complaintSlaRepository.findByComplaintId(complaintId)
                .orElseThrow(() -> new RuntimeException("SLA not tracked for complaint: " + complaintId));

        EscalationLevel currentLevel = sla.getEscalationLevel();
        EscalationLevel nextLevel = getNextLevel(currentLevel);

        if (nextLevel == null) {
            // Already at highest level – no further escalation
            return;
        }

        String escalatedFrom = levelToRole(currentLevel);
        String escalatedTo   = levelToRole(nextLevel);

        // Record in escalation_logs
        EscalationLog log = EscalationLog.builder()
                .complaint(complaint)
                .escalatedFrom(escalatedFrom)
                .escalatedTo(escalatedTo)
                .reason(reason)
                .escalationLevel(nextLevel)
                .build();
        escalationLogRepository.save(log);

        // Advance the SLA escalation level
        sla.setEscalationLevel(nextLevel);
        complaintSlaRepository.save(sla);

        // Notify all users with the target role
        notifyRoleUsers(escalatedTo, complaint, reason);
    }

    @Override
    public List<EscalationLogResponse> getEscalationHistory(Long complaintId) {
        return escalationLogRepository.findByComplaintIdOrderByEscalatedAtDesc(complaintId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<EscalationLogResponse> getAllEscalations() {
        return escalationLogRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /**
     * Called by scheduler every hour.
     * Checks all active SLAs against the escalation_config thresholds
     * and auto-escalates where needed.
     */
    @Override
    public void checkAndEscalateComplaints() {
        List<EscalationConfig> configs = escalationConfigRepository.findAllByOrderByLevelAsc();

        for (EscalationConfig config : configs) {
            LocalDateTime threshold = LocalDateTime.now().minusDays(config.getDaysThreshold());

            // Map level number to EscalationLevel enum
            EscalationLevel currentLevelEnum = intToEscalationLevel(config.getLevel() - 1);
            if (currentLevelEnum == null) continue;

            List<ComplaintSla> eligible = complaintSlaRepository
                    .findByAgeAndEscalationLevel(threshold, currentLevelEnum);

            for (ComplaintSla sla : eligible) {
                String reason = "Auto-escalated: complaint unresolved for " +
                        config.getDaysThreshold() + " days (Level " + config.getLevel() + " threshold)";
                escalateComplaint(sla.getComplaint().getId(), reason);
            }
        }
    }

    // ─────────────────────────── HELPERS ───────────────────────────────────

    private EscalationLevel getNextLevel(EscalationLevel current) {
        return switch (current) {
            case LEVEL_0 -> EscalationLevel.LEVEL_1;
            case LEVEL_1 -> EscalationLevel.LEVEL_2;
            case LEVEL_2 -> EscalationLevel.LEVEL_3;
            case LEVEL_3 -> EscalationLevel.LEVEL_4;
            case LEVEL_4 -> null; // already at top
        };
    }

    private String levelToRole(EscalationLevel level) {
        return switch (level) {
            case LEVEL_0 -> "ROLE_OFFICER";
            case LEVEL_1 -> "ROLE_WARD_SUPERVISOR";
            case LEVEL_2 -> "ROLE_ASSISTANT_COMMISSIONER";
            case LEVEL_3 -> "ROLE_MUNICIPAL_COMMISSIONER";
            case LEVEL_4 -> "ROLE_SUPER_ADMIN";
        };
    }

    private EscalationLevel intToEscalationLevel(int level) {
        return switch (level) {
            case 0 -> EscalationLevel.LEVEL_0;
            case 1 -> EscalationLevel.LEVEL_1;
            case 2 -> EscalationLevel.LEVEL_2;
            case 3 -> EscalationLevel.LEVEL_3;
            case 4 -> EscalationLevel.LEVEL_4;
            default -> null;
        };
    }

    /**
     * Notify all users matching the target role about the escalation.
     * Uses the existing NotificationService (in-app).
     */
    private void notifyRoleUsers(String roleName, Complaint complaint, String reason) {
        userRepository.findAll().stream()
                .filter(u -> u.getRole().name().equals(roleName))
                .forEach(u -> notificationService.sendNotification(
                        u.getId(),
                        "🚨 ESCALATED – Complaint #" + complaint.getId() +
                        " [" + complaint.getTitle() + "] has been escalated to your level. Reason: " + reason
                ));
    }

    private EscalationLogResponse toResponse(EscalationLog log) {
        return EscalationLogResponse.builder()
                .id(log.getId())
                .complaintId(log.getComplaint().getId())
                .complaintTitle(log.getComplaint().getTitle())
                .escalatedFrom(log.getEscalatedFrom())
                .escalatedTo(log.getEscalatedTo())
                .reason(log.getReason())
                .escalationLevel(log.getEscalationLevel())
                .escalatedAt(log.getEscalatedAt())
                .build();
    }
}
