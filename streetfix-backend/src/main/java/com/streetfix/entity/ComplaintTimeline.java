package com.streetfix.entity;

import com.streetfix.enums.ComplaintStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Full timeline / audit trail of a complaint's lifecycle.
 * Each status change, assignment, escalation or important action
 * creates a new timeline entry providing complete traceability.
 */
@Entity
@Table(name = "complaint_timeline")
public class ComplaintTimeline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintStatus status;

    /** Descriptive message for this timeline event */
    @Column(nullable = false, length = 500)
    private String message;

    /** Name or email of the user who triggered this event */
    @Column(name = "created_by", nullable = false)
    private String createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public ComplaintTimeline() {}

    public ComplaintTimeline(Long id, Complaint complaint, ComplaintStatus status,
                             String message, String createdBy, LocalDateTime createdAt) {
        this.id = id;
        this.complaint = complaint;
        this.status = status;
        this.message = message;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Complaint getComplaint() { return complaint; }
    public void setComplaint(Complaint complaint) { this.complaint = complaint; }

    public ComplaintStatus getStatus() { return status; }
    public void setStatus(ComplaintStatus status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static ComplaintTimelineBuilder builder() { return new ComplaintTimelineBuilder(); }

    public static class ComplaintTimelineBuilder {
        private Long id;
        private Complaint complaint;
        private ComplaintStatus status;
        private String message;
        private String createdBy;
        private LocalDateTime createdAt;

        public ComplaintTimelineBuilder id(Long id) { this.id = id; return this; }
        public ComplaintTimelineBuilder complaint(Complaint complaint) { this.complaint = complaint; return this; }
        public ComplaintTimelineBuilder status(ComplaintStatus status) { this.status = status; return this; }
        public ComplaintTimelineBuilder message(String message) { this.message = message; return this; }
        public ComplaintTimelineBuilder createdBy(String createdBy) { this.createdBy = createdBy; return this; }
        public ComplaintTimelineBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ComplaintTimeline build() {
            return new ComplaintTimeline(id, complaint, status, message, createdBy, createdAt);
        }
    }
}
