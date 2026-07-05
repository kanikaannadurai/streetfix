package com.streetfix.dto;

public class HeatmapPointResponse {
    private Double latitude;
    private Double longitude;
    private int intensity; // Based on number of complaints in the area or priority

    public HeatmapPointResponse() {}

    public HeatmapPointResponse(Double latitude, Double longitude, int intensity) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.intensity = intensity;
    }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public int getIntensity() { return intensity; }
    public void setIntensity(int intensity) { this.intensity = intensity; }
}
