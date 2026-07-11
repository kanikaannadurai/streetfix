package com.streetfix.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "receiver_id", nullable = false)
    private Long receiverId;

    @Column(name = "receiver_role", nullable = false)
    private String receiverRole;

    @Column(name = "complaint_id")
    private Long complaintId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Notification() {}

    public Notification(Long id, Long receiverId, String receiverRole, Long complaintId, String title, String message, Boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.receiverId = receiverId;
        this.receiverRole = receiverRole;
        this.complaintId = complaintId;
        this.title = title;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public String getReceiverRole() { return receiverRole; }
    public void setReceiverRole(String receiverRole) { this.receiverRole = receiverRole; }

    public Long getComplaintId() { return complaintId; }
    public void setComplaintId(Long complaintId) { this.complaintId = complaintId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static NotificationBuilder builder() { return new NotificationBuilder(); }

    public static class NotificationBuilder {
        private Long id;
        private Long receiverId;
        private String receiverRole;
        private Long complaintId;
        private String title;
        private String message;
        private Boolean isRead;
        private LocalDateTime createdAt;

        public NotificationBuilder id(Long id) { this.id = id; return this; }
        public NotificationBuilder receiverId(Long receiverId) { this.receiverId = receiverId; return this; }
        public NotificationBuilder receiverRole(String receiverRole) { this.receiverRole = receiverRole; return this; }
        public NotificationBuilder complaintId(Long complaintId) { this.complaintId = complaintId; return this; }
        public NotificationBuilder title(String title) { this.title = title; return this; }
        public NotificationBuilder message(String message) { this.message = message; return this; }
        public NotificationBuilder isRead(Boolean isRead) { this.isRead = isRead; return this; }
        public NotificationBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Notification build() {
            return new Notification(id, receiverId, receiverRole, complaintId, title, message, isRead != null ? isRead : false, createdAt);
        }
    }
}
