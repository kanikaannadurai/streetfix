package com.streetfix.entity;

import jakarta.persistence.*;

/**
 * SLA Configuration per complaint category.
 * Admin can set how many hours an officer has to resolve
 * complaints in each category, and when to start warning.
 */
@Entity
@Table(name = "sla_config")
public class SlaConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Category this SLA applies to (e.g., "Road Damage", "Street Light") */
    @Column(nullable = false, unique = true)
    private String category;

    /** Total hours allowed to resolve the complaint */
    @Column(name = "duration_hours", nullable = false)
    private Integer durationHours;

    /** Hours before deadline to send a warning reminder */
    @Column(name = "warning_hours", nullable = false)
    private Integer warningHours;

    public SlaConfig() {}

    public SlaConfig(Long id, String category, Integer durationHours, Integer warningHours) {
        this.id = id;
        this.category = category;
        this.durationHours = durationHours;
        this.warningHours = warningHours;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getDurationHours() { return durationHours; }
    public void setDurationHours(Integer durationHours) { this.durationHours = durationHours; }

    public Integer getWarningHours() { return warningHours; }
    public void setWarningHours(Integer warningHours) { this.warningHours = warningHours; }

    public static SlaConfigBuilder builder() { return new SlaConfigBuilder(); }

    public static class SlaConfigBuilder {
        private Long id;
        private String category;
        private Integer durationHours;
        private Integer warningHours;

        public SlaConfigBuilder id(Long id) { this.id = id; return this; }
        public SlaConfigBuilder category(String category) { this.category = category; return this; }
        public SlaConfigBuilder durationHours(Integer durationHours) { this.durationHours = durationHours; return this; }
        public SlaConfigBuilder warningHours(Integer warningHours) { this.warningHours = warningHours; return this; }

        public SlaConfig build() {
            return new SlaConfig(id, category, durationHours, warningHours);
        }
    }
}
