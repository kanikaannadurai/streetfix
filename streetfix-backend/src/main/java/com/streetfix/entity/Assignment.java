package com.streetfix.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignments")
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "officer_id")
    private Officer officer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id")
    private Worker worker;

    @CreationTimestamp
    @Column(name = "assigned_date", updatable = false)
    private LocalDateTime assignedDate;

    public Assignment() {}

    public Assignment(Long id, Complaint complaint, Officer officer, Worker worker, LocalDateTime assignedDate) {
        this.id = id;
        this.complaint = complaint;
        this.officer = officer;
        this.worker = worker;
        this.assignedDate = assignedDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Complaint getComplaint() { return complaint; }
    public void setComplaint(Complaint complaint) { this.complaint = complaint; }

    public Officer getOfficer() { return officer; }
    public void setOfficer(Officer officer) { this.officer = officer; }

    public Worker getWorker() { return worker; }
    public void setWorker(Worker worker) { this.worker = worker; }

    public LocalDateTime getAssignedDate() { return assignedDate; }
    public void setAssignedDate(LocalDateTime assignedDate) { this.assignedDate = assignedDate; }

    public static AssignmentBuilder builder() { return new AssignmentBuilder(); }

    public static class AssignmentBuilder {
        private Long id;
        private Complaint complaint;
        private Officer officer;
        private Worker worker;
        private LocalDateTime assignedDate;

        public AssignmentBuilder id(Long id) { this.id = id; return this; }
        public AssignmentBuilder complaint(Complaint complaint) { this.complaint = complaint; return this; }
        public AssignmentBuilder officer(Officer officer) { this.officer = officer; return this; }
        public AssignmentBuilder worker(Worker worker) { this.worker = worker; return this; }
        public AssignmentBuilder assignedDate(LocalDateTime assignedDate) { this.assignedDate = assignedDate; return this; }

        public Assignment build() {
            return new Assignment(id, complaint, officer, worker, assignedDate);
        }
    }
}
