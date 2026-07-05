package com.streetfix.entity;

import com.streetfix.enums.EscalationLevel;
import com.streetfix.enums.SlaStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Tracks the SLA state of each complaint.
 * Created automatically when a complaint is submitted.
 * Updated by the scheduled SLA checker.
 */
@Entity
@Table(name = "complaint_sla")
public class ComplaintSla {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false, unique = true)
    private Complaint complaint;

    /** Calculated deadline = created_at + SLA duration_hours */
    @Column(name = "due_date", nullable = false)
    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SlaStatus status;

    /** Current escalation level of this complaint */
    @Enumerated(EnumType.STRING)
    @Column(name = "escalation_level", nullable = false)
    private EscalationLevel escalationLevel;

    /** Remaining hours until due date (computed, not persisted) */
    @Transient
    private Long remainingHours;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public ComplaintSla() {}

    public ComplaintSla(Long id, Complaint complaint, LocalDateTime dueDate,
                        SlaStatus status, EscalationLevel escalationLevel,
                        LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.complaint = complaint;
        this.dueDate = dueDate;
        this.status = status;
        this.escalationLevel = escalationLevel;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Complaint getComplaint() { return complaint; }
    public void setComplaint(Complaint complaint) { this.complaint = complaint; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }

    public SlaStatus getStatus() { return status; }
    public void setStatus(SlaStatus status) { this.status = status; }

    public EscalationLevel getEscalationLevel() { return escalationLevel; }
    public void setEscalationLevel(EscalationLevel escalationLevel) { this.escalationLevel = escalationLevel; }

    public Long getRemainingHours() { return remainingHours; }
    public void setRemainingHours(Long remainingHours) { this.remainingHours = remainingHours; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static ComplaintSlaBuilder builder() { return new ComplaintSlaBuilder(); }

    public static class ComplaintSlaBuilder {
        private Long id;
        private Complaint complaint;
        private LocalDateTime dueDate;
        private SlaStatus status;
        private EscalationLevel escalationLevel;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public ComplaintSlaBuilder id(Long id) { this.id = id; return this; }
        public ComplaintSlaBuilder complaint(Complaint complaint) { this.complaint = complaint; return this; }
        public ComplaintSlaBuilder dueDate(LocalDateTime dueDate) { this.dueDate = dueDate; return this; }
        public ComplaintSlaBuilder status(SlaStatus status) { this.status = status; return this; }
        public ComplaintSlaBuilder escalationLevel(EscalationLevel escalationLevel) { this.escalationLevel = escalationLevel; return this; }
        public ComplaintSlaBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ComplaintSlaBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public ComplaintSla build() {
            return new ComplaintSla(id, complaint, dueDate, status, escalationLevel, createdAt, updatedAt);
        }
    }
}
