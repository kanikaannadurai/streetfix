package com.streetfix.entity;

import com.streetfix.enums.ComplaintStatus;
import com.streetfix.enums.Priority;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintStatus status;

    private Double latitude;
    private Double longitude;

    @Column(length = 1000)
    private String address;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "asset_code")
    private String assetCode;

    @Column(name = "before_image_url")
    private String beforeImageUrl;

    @Column(name = "after_image_url")
    private String afterImageUrl;

    @Column(name = "citizen_remarks", length = 1000)
    private String citizenRemarks;

    @Column(name = "citizen_approved")
    private Boolean citizenApproved;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizen_id", nullable = false)
    private User citizen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ward_supervisor_id")
    private User wardSupervisor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id")
    private User worker;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Complaint() {}

    public Complaint(Long id, String title, String description, String category, Priority priority,
                     ComplaintStatus status, Double latitude, Double longitude, String address, String imageUrl, String assetCode,
                     String beforeImageUrl, String afterImageUrl, String citizenRemarks, Boolean citizenApproved,
                     User citizen, User wardSupervisor, User worker, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.status = status;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.imageUrl = imageUrl;
        this.assetCode = assetCode;
        this.beforeImageUrl = beforeImageUrl;
        this.afterImageUrl = afterImageUrl;
        this.citizenRemarks = citizenRemarks;
        this.citizenApproved = citizenApproved;
        this.citizen = citizen;
        this.wardSupervisor = wardSupervisor;
        this.worker = worker;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getAssetCode() { return assetCode; }
    public void setAssetCode(String assetCode) { this.assetCode = assetCode; }

    public String getBeforeImageUrl() { return beforeImageUrl; }
    public void setBeforeImageUrl(String beforeImageUrl) { this.beforeImageUrl = beforeImageUrl; }

    public String getAfterImageUrl() { return afterImageUrl; }
    public void setAfterImageUrl(String afterImageUrl) { this.afterImageUrl = afterImageUrl; }

    public String getCitizenRemarks() { return citizenRemarks; }
    public void setCitizenRemarks(String citizenRemarks) { this.citizenRemarks = citizenRemarks; }

    public Boolean getCitizenApproved() { return citizenApproved; }
    public void setCitizenApproved(Boolean citizenApproved) { this.citizenApproved = citizenApproved; }

    public User getCitizen() { return citizen; }
    public void setCitizen(User citizen) { this.citizen = citizen; }

    public User getWardSupervisor() { return wardSupervisor; }
    public void setWardSupervisor(User wardSupervisor) { this.wardSupervisor = wardSupervisor; }

    public User getWorker() { return worker; }
    public void setWorker(User worker) { this.worker = worker; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static ComplaintBuilder builder() { return new ComplaintBuilder(); }

    public static class ComplaintBuilder {
        private Long id;
        private String title;
        private String description;
        private String category;
        private Priority priority;
        private ComplaintStatus status;
        private Double latitude;
        private Double longitude;
        private String address;
        private String imageUrl;
        private String assetCode;
        private String beforeImageUrl;
        private String afterImageUrl;
        private String citizenRemarks;
        private Boolean citizenApproved;
        private User citizen;
        private User wardSupervisor;
        private User worker;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public ComplaintBuilder id(Long id) { this.id = id; return this; }
        public ComplaintBuilder title(String title) { this.title = title; return this; }
        public ComplaintBuilder description(String description) { this.description = description; return this; }
        public ComplaintBuilder category(String category) { this.category = category; return this; }
        public ComplaintBuilder priority(Priority priority) { this.priority = priority; return this; }
        public ComplaintBuilder status(ComplaintStatus status) { this.status = status; return this; }
        public ComplaintBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public ComplaintBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public ComplaintBuilder address(String address) { this.address = address; return this; }
        public ComplaintBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public ComplaintBuilder assetCode(String assetCode) { this.assetCode = assetCode; return this; }
        public ComplaintBuilder beforeImageUrl(String beforeImageUrl) { this.beforeImageUrl = beforeImageUrl; return this; }
        public ComplaintBuilder afterImageUrl(String afterImageUrl) { this.afterImageUrl = afterImageUrl; return this; }
        public ComplaintBuilder citizenRemarks(String citizenRemarks) { this.citizenRemarks = citizenRemarks; return this; }
        public ComplaintBuilder citizenApproved(Boolean citizenApproved) { this.citizenApproved = citizenApproved; return this; }
        public ComplaintBuilder citizen(User citizen) { this.citizen = citizen; return this; }
        public ComplaintBuilder wardSupervisor(User wardSupervisor) { this.wardSupervisor = wardSupervisor; return this; }
        public ComplaintBuilder worker(User worker) { this.worker = worker; return this; }
        public ComplaintBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ComplaintBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Complaint build() {
            return new Complaint(id, title, description, category, priority, status, latitude, longitude, address, imageUrl, assetCode, beforeImageUrl, afterImageUrl, citizenRemarks, citizenApproved, citizen, wardSupervisor, worker, createdAt, updatedAt);
        }
    }
}
