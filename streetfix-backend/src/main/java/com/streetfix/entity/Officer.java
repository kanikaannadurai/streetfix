package com.streetfix.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "officers")
public class Officer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String department;

    public Officer() {}

    public Officer(Long id, User user, String department) {
        this.id = id;
        this.user = user;
        this.department = department;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public static OfficerBuilder builder() { return new OfficerBuilder(); }

    public static class OfficerBuilder {
        private Long id;
        private User user;
        private String department;

        public OfficerBuilder id(Long id) { this.id = id; return this; }
        public OfficerBuilder user(User user) { this.user = user; return this; }
        public OfficerBuilder department(String department) { this.department = department; return this; }

        public Officer build() {
            return new Officer(id, user, department);
        }
    }
}
