package com.streetfix.dto;

public class SlaConfigResponse {

    private Long id;
    private String category;
    private Integer durationHours;
    private Integer warningHours;

    public SlaConfigResponse() {}

    public SlaConfigResponse(Long id, String category, Integer durationHours, Integer warningHours) {
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

    public static SlaConfigResponseBuilder builder() { return new SlaConfigResponseBuilder(); }

    public static class SlaConfigResponseBuilder {
        private Long id;
        private String category;
        private Integer durationHours;
        private Integer warningHours;

        public SlaConfigResponseBuilder id(Long id) { this.id = id; return this; }
        public SlaConfigResponseBuilder category(String category) { this.category = category; return this; }
        public SlaConfigResponseBuilder durationHours(Integer durationHours) { this.durationHours = durationHours; return this; }
        public SlaConfigResponseBuilder warningHours(Integer warningHours) { this.warningHours = warningHours; return this; }

        public SlaConfigResponse build() {
            return new SlaConfigResponse(id, category, durationHours, warningHours);
        }
    }
}
