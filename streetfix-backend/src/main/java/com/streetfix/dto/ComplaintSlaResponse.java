package com.streetfix.dto;

import com.streetfix.enums.EscalationLevel;
import com.streetfix.enums.SlaStatus;

import java.time.LocalDateTime;

public class ComplaintSlaResponse {

    private Long id;
    private Long complaintId;
    private String complaintTitle;
    private LocalDateTime dueDate;
    private SlaStatus status;
    private EscalationLevel escalationLevel;
    private Long remainingHours;   // negative = overdue
    private boolean isOverdue;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ComplaintSlaResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getComplaintId() { return complaintId; }
    public void setComplaintId(Long complaintId) { this.complaintId = complaintId; }

    public String getComplaintTitle() { return complaintTitle; }
    public void setComplaintTitle(String complaintTitle) { this.complaintTitle = complaintTitle; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }

    public SlaStatus getStatus() { return status; }
    public void setStatus(SlaStatus status) { this.status = status; }

    public EscalationLevel getEscalationLevel() { return escalationLevel; }
    public void setEscalationLevel(EscalationLevel escalationLevel) { this.escalationLevel = escalationLevel; }

    public Long getRemainingHours() { return remainingHours; }
    public void setRemainingHours(Long remainingHours) { this.remainingHours = remainingHours; }

    public boolean isOverdue() { return isOverdue; }
    public void setOverdue(boolean overdue) { isOverdue = overdue; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static ComplaintSlaResponseBuilder builder() { return new ComplaintSlaResponseBuilder(); }

    public static class ComplaintSlaResponseBuilder {
        private final ComplaintSlaResponse r = new ComplaintSlaResponse();
        public ComplaintSlaResponseBuilder id(Long id) { r.id = id; return this; }
        public ComplaintSlaResponseBuilder complaintId(Long v) { r.complaintId = v; return this; }
        public ComplaintSlaResponseBuilder complaintTitle(String v) { r.complaintTitle = v; return this; }
        public ComplaintSlaResponseBuilder dueDate(LocalDateTime v) { r.dueDate = v; return this; }
        public ComplaintSlaResponseBuilder status(SlaStatus v) { r.status = v; return this; }
        public ComplaintSlaResponseBuilder escalationLevel(EscalationLevel v) { r.escalationLevel = v; return this; }
        public ComplaintSlaResponseBuilder remainingHours(Long v) { r.remainingHours = v; return this; }
        public ComplaintSlaResponseBuilder isOverdue(boolean v) { r.isOverdue = v; return this; }
        public ComplaintSlaResponseBuilder createdAt(LocalDateTime v) { r.createdAt = v; return this; }
        public ComplaintSlaResponseBuilder updatedAt(LocalDateTime v) { r.updatedAt = v; return this; }
        public ComplaintSlaResponse build() { return r; }
    }
}
