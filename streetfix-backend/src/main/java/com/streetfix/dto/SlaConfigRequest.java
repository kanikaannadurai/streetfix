package com.streetfix.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SlaConfigRequest {

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Duration hours is required")
    @Min(value = 1, message = "Duration must be at least 1 hour")
    private Integer durationHours;

    @NotNull(message = "Warning hours is required")
    @Min(value = 1, message = "Warning hours must be at least 1 hour")
    private Integer warningHours;

    public SlaConfigRequest() {}

    public SlaConfigRequest(String category, Integer durationHours, Integer warningHours) {
        this.category = category;
        this.durationHours = durationHours;
        this.warningHours = warningHours;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getDurationHours() { return durationHours; }
    public void setDurationHours(Integer durationHours) { this.durationHours = durationHours; }

    public Integer getWarningHours() { return warningHours; }
    public void setWarningHours(Integer warningHours) { this.warningHours = warningHours; }
}
