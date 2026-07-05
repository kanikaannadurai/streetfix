package com.streetfix.entity;

import com.streetfix.enums.EscalationLevel;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Audit trail for every escalation action.
 * Records who escalated the complaint, to whom, and why.
 */
@Entity
@Table(name = "escalation_logs")
public class EscalationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    /** Role that previously held the complaint */
    @Column(name = "escalated_from", nullable = false)
    private String escalatedFrom;

    /** Role that now holds / is notified about the complaint */
    @Column(name = "escalated_to", nullable = false)
    private String escalatedTo;

    /** Human-readable reason (e.g., "SLA breached – 7 days unresolved") */
    @Column(nullable = false, length = 500)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "escalation_level", nullable = false)
    private EscalationLevel escalationLevel;

    @CreationTimestamp
    @Column(name = "escalated_at", updatable = false)
    private LocalDateTime escalatedAt;

    public EscalationLog() {}

    public EscalationLog(Long id, Complaint complaint, String escalatedFrom, String escalatedTo,
                         String reason, EscalationLevel escalationLevel, LocalDateTime escalatedAt) {
        this.id = id;
        this.complaint = complaint;
        this.escalatedFrom = escalatedFrom;
        this.escalatedTo = escalatedTo;
        this.reason = reason;
        this.escalationLevel = escalationLevel;
        this.escalatedAt = escalatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Complaint getComplaint() { return complaint; }
    public void setComplaint(Complaint complaint) { this.complaint = complaint; }

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

    public static EscalationLogBuilder builder() { return new EscalationLogBuilder(); }

    public static class EscalationLogBuilder {
        private Long id;
        private Complaint complaint;
        private String escalatedFrom;
        private String escalatedTo;
        private String reason;
        private EscalationLevel escalationLevel;
        private LocalDateTime escalatedAt;

        public EscalationLogBuilder id(Long id) { this.id = id; return this; }
        public EscalationLogBuilder complaint(Complaint complaint) { this.complaint = complaint; return this; }
        public EscalationLogBuilder escalatedFrom(String escalatedFrom) { this.escalatedFrom = escalatedFrom; return this; }
        public EscalationLogBuilder escalatedTo(String escalatedTo) { this.escalatedTo = escalatedTo; return this; }
        public EscalationLogBuilder reason(String reason) { this.reason = reason; return this; }
        public EscalationLogBuilder escalationLevel(EscalationLevel escalationLevel) { this.escalationLevel = escalationLevel; return this; }
        public EscalationLogBuilder escalatedAt(LocalDateTime escalatedAt) { this.escalatedAt = escalatedAt; return this; }

        public EscalationLog build() {
            return new EscalationLog(id, complaint, escalatedFrom, escalatedTo, reason, escalationLevel, escalatedAt);
        }
    }
}
