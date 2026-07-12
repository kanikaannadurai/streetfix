package com.streetfix.service.impl;

import com.streetfix.entity.Complaint;
import com.streetfix.entity.Officer;
import com.streetfix.repository.OfficerRepository;
import com.streetfix.service.DisciplinaryService;
import com.streetfix.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DisciplinaryServiceImpl implements DisciplinaryService {

    private final OfficerRepository officerRepository;
    private final NotificationService notificationService;

    public DisciplinaryServiceImpl(OfficerRepository officerRepository, NotificationService notificationService) {
        this.officerRepository = officerRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public void applySlaViolationDiscipline(Complaint complaint, Officer officer) {
        if (officer == null) return;

        // Reduce performance score
        double currentScore = officer.getPerformanceScore() != null ? officer.getPerformanceScore() : 100.0;
        officer.setPerformanceScore(Math.max(0.0, currentScore - 5.0));

        // Increment violations logic (using strikes and warnings)
        int totalViolations = (officer.getWarningCount() != null ? officer.getWarningCount() : 0) 
                            + (officer.getStrikes() != null ? officer.getStrikes() * 2 : 0) + 1;

        if (totalViolations == 1) {
            officer.setWarningCount(1);
            notificationService.sendNotification(officer.getUser().getId(), 
                "WARNING: You have breached the SLA for complaint #" + complaint.getId() + ".");
        } else if (totalViolations == 2) {
            officer.setWarningCount(2);
            notificationService.sendNotification(officer.getUser().getId(), 
                "FINAL WARNING: You have breached the SLA for complaint #" + complaint.getId() + ".");
        } else if (totalViolations == 3 || totalViolations == 4) {
            officer.setStrikes((officer.getStrikes() != null ? officer.getStrikes() : 0) + 1);
            notificationService.sendNotification(officer.getUser().getId(), 
                "STRIKE: Repeated SLA breaches. Complaint #" + complaint.getId() + " has been escalated to Ward Supervisor.");
            // Note: Actual escalation logic is handled by EscalationService separately in the scheduler
        } else if (totalViolations == 5) {
            officer.setStrikes((officer.getStrikes() != null ? officer.getStrikes() : 0) + 1);
            notificationService.sendNotification(officer.getUser().getId(), 
                "CRITICAL STRIKE: SLA breach for complaint #" + complaint.getId() + ". Your profile is flagged for Admin review.");
        } else {
            officer.setSuspensionRecommended(true);
            notificationService.sendNotification(officer.getUser().getId(), 
                "SUSPENSION RECOMMENDED: Excessive SLA violations. An alert has been sent to the Admin.");
        }

        officerRepository.save(officer);
    }
}
