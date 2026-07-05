package com.streetfix.dto;

import com.streetfix.enums.ComplaintStatus;

import java.time.LocalDateTime;

public class ComplaintTimelineResponse {

    private Long id;
    private Long complaintId;
    private ComplaintStatus status;
    private String statusLabel;   // human-readable label
    private String message;
    private String createdBy;
    private LocalDateTime createdAt;

    public ComplaintTimelineResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getComplaintId() { return complaintId; }
    public void setComplaintId(Long complaintId) { this.complaintId = complaintId; }

    public ComplaintStatus getStatus() { return status; }
    public void setStatus(ComplaintStatus status) { this.status = status; }

    public String getStatusLabel() { return statusLabel; }
    public void setStatusLabel(String statusLabel) { this.statusLabel = statusLabel; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final ComplaintTimelineResponse r = new ComplaintTimelineResponse();
        public Builder id(Long v) { r.id = v; return this; }
        public Builder complaintId(Long v) { r.complaintId = v; return this; }
        public Builder status(ComplaintStatus v) { r.status = v; return this; }
        public Builder statusLabel(String v) { r.statusLabel = v; return this; }
        public Builder message(String v) { r.message = v; return this; }
        public Builder createdBy(String v) { r.createdBy = v; return this; }
        public Builder createdAt(LocalDateTime v) { r.createdAt = v; return this; }
        public ComplaintTimelineResponse build() { return r; }
    }
}
