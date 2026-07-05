package com.streetfix.dto;

public class DuplicateComplaintResponse {

    private Long id;
    private String title;
    private String category;
    private Double similarityScore;
    private Double distanceMeters;
    
    public DuplicateComplaintResponse() {}

    public DuplicateComplaintResponse(Long id, String title, String category, Double similarityScore, Double distanceMeters) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.similarityScore = similarityScore;
        this.distanceMeters = distanceMeters;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getSimilarityScore() { return similarityScore; }
    public void setSimilarityScore(Double similarityScore) { this.similarityScore = similarityScore; }

    public Double getDistanceMeters() { return distanceMeters; }
    public void setDistanceMeters(Double distanceMeters) { this.distanceMeters = distanceMeters; }
    
    public static DuplicateComplaintResponseBuilder builder() { return new DuplicateComplaintResponseBuilder(); }
    
    public static class DuplicateComplaintResponseBuilder {
        private Long id;
        private String title;
        private String category;
        private Double similarityScore;
        private Double distanceMeters;
        
        public DuplicateComplaintResponseBuilder id(Long id) { this.id = id; return this; }
        public DuplicateComplaintResponseBuilder title(String title) { this.title = title; return this; }
        public DuplicateComplaintResponseBuilder category(String category) { this.category = category; return this; }
        public DuplicateComplaintResponseBuilder similarityScore(Double similarityScore) { this.similarityScore = similarityScore; return this; }
        public DuplicateComplaintResponseBuilder distanceMeters(Double distanceMeters) { this.distanceMeters = distanceMeters; return this; }
        
        public DuplicateComplaintResponse build() {
            return new DuplicateComplaintResponse(id, title, category, similarityScore, distanceMeters);
        }
    }
}
