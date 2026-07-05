package com.streetfix.dto;

import com.streetfix.enums.EscalationLevel;

import java.time.LocalDateTime;

public class EscalationLogResponse {

    private Long id;
    private Long complaintId;
    private String complaintTitle;
    private String escalatedFrom;
    private String escalatedTo;
    private String reason;
    private EscalationLevel escalationLevel;
    private LocalDateTime escalatedAt;

    public EscalationLogResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getComplaintId() { return complaintId; }
    public void setComplaintId(Long complaintId) { this.complaintId = complaintId; }

    public String getComplaintTitle() { return complaintTitle; }
    public void setComplaintTitle(String complaintTitle) { this.complaintTitle = complaintTitle; }

    public String getEscalatedFrom() { return escalatedFrom; }
    public void setEscalatedFrom(String escalatedFrom) { this.escalatedFrom = escalatedFrom; }

    public String getEscalatedTo() { return escalatedTo; }
    public void setEscalatedTo(String escalatedTo) { this.escalatedTo = escalatedTo; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public EscalationLevel getEscalationLevel() { return escalationLevel; }
    public void setEscalationLevel(EscalationLevel escalationLevel) { this.escalationLevel = escalationLevel; }

    public LocalDateTime getEscalatedAt() { return escalatedAt; }
    public void setEscalatedAt(LocalDateTime escalatedAt) { this.escalatedAt = escalatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final EscalationLogResponse r = new EscalationLogResponse();
        public Builder id(Long v) { r.id = v; return this; }
        public Builder complaintId(Long v) { r.complaintId = v; return this; }
        public Builder complaintTitle(String v) { r.complaintTitle = v; return this; }
        public Builder escalatedFrom(String v) { r.escalatedFrom = v; return this; }
        public Builder escalatedTo(String v) { r.escalatedTo = v; return this; }
        public Builder reason(String v) { r.reason = v; return this; }
        public Builder escalationLevel(EscalationLevel v) { r.escalationLevel = v; return this; }
        public Builder escalatedAt(LocalDateTime v) { r.escalatedAt = v; return this; }
        public EscalationLogResponse build() { return r; }
    }
}
