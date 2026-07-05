package com.streetfix.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false, unique = true)
    private Complaint complaint;

    @Column(nullable = false)
    private Integer rating; // 1 to 5

    @Column(length = 1000)
    private String comments;

    public Feedback() {}

    public Feedback(Long id, Complaint complaint, Integer rating, String comments) {
        this.id = id;
        this.complaint = complaint;
        this.rating = rating;
        this.comments = comments;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Complaint getComplaint() { return complaint; }
    public void setComplaint(Complaint complaint) { this.complaint = complaint; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public static FeedbackBuilder builder() { return new FeedbackBuilder(); }

    public static class FeedbackBuilder {
        private Long id;
        private Complaint complaint;
        private Integer rating;
        private String comments;

        public FeedbackBuilder id(Long id) { this.id = id; return this; }
        public FeedbackBuilder complaint(Complaint complaint) { this.complaint = complaint; return this; }
        public FeedbackBuilder rating(Integer rating) { this.rating = rating; return this; }
        public FeedbackBuilder comments(String comments) { this.comments = comments; return this; }

        public Feedback build() {
            return new Feedback(id, complaint, rating, comments);
        }
    }
}
