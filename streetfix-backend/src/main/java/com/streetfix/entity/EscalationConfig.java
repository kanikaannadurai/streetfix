package com.streetfix.entity;

import jakarta.persistence.*;

/**
 * Configures escalation thresholds and target roles.
 * Admin-manageable table that drives the automatic escalation engine.
 *
 * Example rows:
 *   level=1, days_threshold=3, notify_role=ROLE_OFFICER        (reminder)
 *   level=2, days_threshold=7, notify_role=ROLE_WARD_SUPERVISOR (escalate)
 *   level=3, days_threshold=15, notify_role=ROLE_MUNICIPAL_COMMISSIONER (critical)
 */
@Entity
@Table(name = "escalation_config")
public class EscalationConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Escalation level number (1, 2, 3) */
    @Column(nullable = false, unique = true)
    private Integer level;

    /** Number of days unresolved before this escalation triggers */
    @Column(name = "days_threshold", nullable = false)
    private Integer daysThreshold;

    /** Role to notify/escalate to (matches Role enum values) */
    @Column(name = "notify_role", nullable = false)
    private String notifyRole;

    /** Human-readable description of this escalation level */
    @Column(length = 300)
    private String description;

    public EscalationConfig() {}

    public EscalationConfig(Long id, Integer level, Integer daysThreshold, String notifyRole, String description) {
        this.id = id;
        this.level = level;
        this.daysThreshold = daysThreshold;
        this.notifyRole = notifyRole;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public Integer getDaysThreshold() { return daysThreshold; }
    public void setDaysThreshold(Integer daysThreshold) { this.daysThreshold = daysThreshold; }

    public String getNotifyRole() { return notifyRole; }
    public void setNotifyRole(String notifyRole) { this.notifyRole = notifyRole; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public static EscalationConfigBuilder builder() { return new EscalationConfigBuilder(); }

    public static class EscalationConfigBuilder {
        private Long id;
        private Integer level;
        private Integer daysThreshold;
        private String notifyRole;
        private String description;

        public EscalationConfigBuilder id(Long id) { this.id = id; return this; }
        public EscalationConfigBuilder level(Integer level) { this.level = level; return this; }
        public EscalationConfigBuilder daysThreshold(Integer daysThreshold) { this.daysThreshold = daysThreshold; return this; }
        public EscalationConfigBuilder notifyRole(String notifyRole) { this.notifyRole = notifyRole; return this; }
        public EscalationConfigBuilder description(String description) { this.description = description; return this; }

        public EscalationConfig build() {
            return new EscalationConfig(id, level, daysThreshold, notifyRole, description);
        }
    }
}
