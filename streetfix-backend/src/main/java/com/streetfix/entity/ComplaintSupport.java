package com.streetfix.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Tracks citizens who support/verify an existing complaint.
 * Used to organically increase the priority of a complaint based on community feedback.
 */
@Entity
@Table(name = "complaint_supports")
public class ComplaintSupport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizen_id", nullable = false)
    private User citizen;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public ComplaintSupport() {}

    public ComplaintSupport(Long id, Complaint complaint, User citizen, LocalDateTime createdAt) {
        this.id = id;
        this.complaint = complaint;
        this.citizen = citizen;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Complaint getComplaint() { return complaint; }
    public void setComplaint(Complaint complaint) { this.complaint = complaint; }

    public User getCitizen() { return citizen; }
    public void setCitizen(User citizen) { this.citizen = citizen; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static ComplaintSupportBuilder builder() { return new ComplaintSupportBuilder(); }

    public static class ComplaintSupportBuilder {
        private Long id;
        private Complaint complaint;
        private User citizen;
        private LocalDateTime createdAt;

        public ComplaintSupportBuilder id(Long id) { this.id = id; return this; }
        public ComplaintSupportBuilder complaint(Complaint complaint) { this.complaint = complaint; return this; }
        public ComplaintSupportBuilder citizen(User citizen) { this.citizen = citizen; return this; }
        public ComplaintSupportBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ComplaintSupport build() {
            return new ComplaintSupport(id, complaint, citizen, createdAt);
        }
    }
}
