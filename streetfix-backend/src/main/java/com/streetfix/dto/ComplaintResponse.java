package com.streetfix.dto;

import com.streetfix.enums.ComplaintStatus;
import com.streetfix.enums.Priority;

import java.time.LocalDateTime;

public class ComplaintResponse {

    private Long id;
    private String title;
    private String description;
    private String category;
    private Priority priority;
    private ComplaintStatus status;
    private Double latitude;
    private Double longitude;
    private String imageUrl;
    private String assetCode;
    private Long citizenId;
    private String citizenName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long supportCount;

    public ComplaintResponse() {}

    private ComplaintResponse(ComplaintResponseBuilder b) {
        this.id = b.id;
        this.title = b.title;
        this.description = b.description;
        this.category = b.category;
        this.priority = b.priority;
        this.status = b.status;
        this.latitude = b.latitude;
        this.longitude = b.longitude;
        this.imageUrl = b.imageUrl;
        this.assetCode = b.assetCode;
        this.citizenId = b.citizenId;
        this.citizenName = b.citizenName;
        this.createdAt = b.createdAt;
        this.updatedAt = b.updatedAt;
        this.supportCount = b.supportCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public ComplaintStatus getStatus() { return status; }
    public void setStatus(ComplaintStatus status) { this.status = status; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getAssetCode() { return assetCode; }
    public void setAssetCode(String assetCode) { this.assetCode = assetCode; }

    public Long getCitizenId() { return citizenId; }
    public void setCitizenId(Long citizenId) { this.citizenId = citizenId; }

    public String getCitizenName() { return citizenName; }
    public void setCitizenName(String citizenName) { this.citizenName = citizenName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getSupportCount() { return supportCount; }
    public void setSupportCount(Long supportCount) { this.supportCount = supportCount; }

    public static ComplaintResponseBuilder builder() { return new ComplaintResponseBuilder(); }

    public static class ComplaintResponseBuilder {
        private Long id;
        private String title;
        private String description;
        private String category;
        private Priority priority;
        private ComplaintStatus status;
        private Double latitude;
        private Double longitude;
        private String imageUrl;
        private String assetCode;
        private Long citizenId;
        private String citizenName;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private Long supportCount;

        public ComplaintResponseBuilder id(Long id) { this.id = id; return this; }
        public ComplaintResponseBuilder title(String title) { this.title = title; return this; }
        public ComplaintResponseBuilder description(String description) { this.description = description; return this; }
        public ComplaintResponseBuilder category(String category) { this.category = category; return this; }
        public ComplaintResponseBuilder priority(Priority priority) { this.priority = priority; return this; }
        public ComplaintResponseBuilder status(ComplaintStatus status) { this.status = status; return this; }
        public ComplaintResponseBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public ComplaintResponseBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public ComplaintResponseBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public ComplaintResponseBuilder assetCode(String assetCode) { this.assetCode = assetCode; return this; }
        public ComplaintResponseBuilder citizenId(Long citizenId) { this.citizenId = citizenId; return this; }
        public ComplaintResponseBuilder citizenName(String citizenName) { this.citizenName = citizenName; return this; }
        public ComplaintResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ComplaintResponseBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public ComplaintResponseBuilder supportCount(Long supportCount) { this.supportCount = supportCount; return this; }

        public ComplaintResponse build() { return new ComplaintResponse(this); }
    }
}
