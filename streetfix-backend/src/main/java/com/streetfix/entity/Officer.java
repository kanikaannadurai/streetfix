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

    @Column(name = "performance_score")
    private Double performanceScore = 100.0;

    @Column(name = "warning_count")
    private Integer warningCount = 0;

    @Column(name = "strikes")
    private Integer strikes = 0;

    @Column(name = "suspension_recommended")
    private Boolean suspensionRecommended = false;

    @Column(name = "escalation_count")
    private Integer escalationCount = 0;

    @Column(name = "average_resolution_time")
    private Double averageResolutionTime = 0.0;

    @Column(name = "monthly_ranking")
    private Integer monthlyRanking;

    public Officer() {}

    public Officer(Long id, User user, String department, Double performanceScore, Integer warningCount,
                   Integer strikes, Boolean suspensionRecommended, Integer escalationCount,
                   Double averageResolutionTime, Integer monthlyRanking) {
        this.id = id;
        this.user = user;
        this.department = department;
        this.performanceScore = performanceScore;
        this.warningCount = warningCount;
        this.strikes = strikes;
        this.suspensionRecommended = suspensionRecommended;
        this.escalationCount = escalationCount;
        this.averageResolutionTime = averageResolutionTime;
        this.monthlyRanking = monthlyRanking;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Double getPerformanceScore() { return performanceScore; }
    public void setPerformanceScore(Double performanceScore) { this.performanceScore = performanceScore; }

    public Integer getWarningCount() { return warningCount; }
    public void setWarningCount(Integer warningCount) { this.warningCount = warningCount; }

    public Integer getStrikes() { return strikes; }
    public void setStrikes(Integer strikes) { this.strikes = strikes; }

    public Boolean getSuspensionRecommended() { return suspensionRecommended; }
    public void setSuspensionRecommended(Boolean suspensionRecommended) { this.suspensionRecommended = suspensionRecommended; }

    public Integer getEscalationCount() { return escalationCount; }
    public void setEscalationCount(Integer escalationCount) { this.escalationCount = escalationCount; }

    public Double getAverageResolutionTime() { return averageResolutionTime; }
    public void setAverageResolutionTime(Double averageResolutionTime) { this.averageResolutionTime = averageResolutionTime; }

    public Integer getMonthlyRanking() { return monthlyRanking; }
    public void setMonthlyRanking(Integer monthlyRanking) { this.monthlyRanking = monthlyRanking; }

    public static OfficerBuilder builder() { return new OfficerBuilder(); }

    public static class OfficerBuilder {
        private Long id;
        private User user;
        private String department;
        private Double performanceScore = 100.0;
        private Integer warningCount = 0;
        private Integer strikes = 0;
        private Boolean suspensionRecommended = false;
        private Integer escalationCount = 0;
        private Double averageResolutionTime = 0.0;
        private Integer monthlyRanking;

        public OfficerBuilder id(Long id) { this.id = id; return this; }
        public OfficerBuilder user(User user) { this.user = user; return this; }
        public OfficerBuilder department(String department) { this.department = department; return this; }
        public OfficerBuilder performanceScore(Double performanceScore) { this.performanceScore = performanceScore; return this; }
        public OfficerBuilder warningCount(Integer warningCount) { this.warningCount = warningCount; return this; }
        public OfficerBuilder strikes(Integer strikes) { this.strikes = strikes; return this; }
        public OfficerBuilder suspensionRecommended(Boolean suspensionRecommended) { this.suspensionRecommended = suspensionRecommended; return this; }
        public OfficerBuilder escalationCount(Integer escalationCount) { this.escalationCount = escalationCount; return this; }
        public OfficerBuilder averageResolutionTime(Double averageResolutionTime) { this.averageResolutionTime = averageResolutionTime; return this; }
        public OfficerBuilder monthlyRanking(Integer monthlyRanking) { this.monthlyRanking = monthlyRanking; return this; }

        public Officer build() {
            return new Officer(id, user, department, performanceScore, warningCount, strikes,
                    suspensionRecommended, escalationCount, averageResolutionTime, monthlyRanking);
        }
    }
}
