package com.streetfix.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Represents a public infrastructure asset (e.g. Dustbin, Street Light, Park Bench)
 * managed by the municipality, which can be linked to a QR code.
 */
@Entity
@Table(name = "assets")
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "asset_code", unique = true, nullable = false)
    private String assetCode; // Unique code (e.g. DUSTBIN-102)

    @Column(nullable = false)
    private String type; // e.g. DUSTBIN, STREET_LIGHT, BUS_STOP

    private Double latitude;
    private Double longitude;

    @Column(name = "location_name")
    private String locationName; // Human readable location

    @Column(nullable = false)
    private String status; // ACTIVE, INACTIVE, UNDER_MAINTENANCE

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Asset() {}

    private Asset(AssetBuilder b) {
        this.id = b.id;
        this.assetCode = b.assetCode;
        this.type = b.type;
        this.latitude = b.latitude;
        this.longitude = b.longitude;
        this.locationName = b.locationName;
        this.status = b.status;
        this.createdAt = b.createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAssetCode() { return assetCode; }
    public void setAssetCode(String assetCode) { this.assetCode = assetCode; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static AssetBuilder builder() { return new AssetBuilder(); }

    public static class AssetBuilder {
        private Long id;
        private String assetCode;
        private String type;
        private Double latitude;
        private Double longitude;
        private String locationName;
        private String status;
        private LocalDateTime createdAt;

        public AssetBuilder id(Long id) { this.id = id; return this; }
        public AssetBuilder assetCode(String assetCode) { this.assetCode = assetCode; return this; }
        public AssetBuilder type(String type) { this.type = type; return this; }
        public AssetBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public AssetBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public AssetBuilder locationName(String locationName) { this.locationName = locationName; return this; }
        public AssetBuilder status(String status) { this.status = status; return this; }
        public AssetBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Asset build() { return new Asset(this); }
    }
}
