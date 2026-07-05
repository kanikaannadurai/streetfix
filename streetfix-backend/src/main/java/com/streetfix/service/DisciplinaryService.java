package com.streetfix.service;

import com.streetfix.entity.Officer;
import com.streetfix.entity.Complaint;

public interface DisciplinaryService {
    /**
     * Applies disciplinary action based on SLA violation for a given complaint.
     * Updates officer accountability metrics and triggers appropriate escalation/notifications.
     */
    void applySlaViolationDiscipline(Complaint complaint, Officer officer);
}
