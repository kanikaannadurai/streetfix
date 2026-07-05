package com.streetfix.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "workers")
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String specialization;

    public Worker() {}

    public Worker(Long id, User user, String specialization) {
        this.id = id;
        this.user = user;
        this.specialization = specialization;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public static WorkerBuilder builder() { return new WorkerBuilder(); }

    public static class WorkerBuilder {
        private Long id;
        private User user;
        private String specialization;

        public WorkerBuilder id(Long id) { this.id = id; return this; }
        public WorkerBuilder user(User user) { this.user = user; return this; }
        public WorkerBuilder specialization(String specialization) { this.specialization = specialization; return this; }

        public Worker build() {
            return new Worker(id, user, specialization);
        }
    }
}
