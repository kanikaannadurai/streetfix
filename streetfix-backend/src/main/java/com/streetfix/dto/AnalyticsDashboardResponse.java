package com.streetfix.dto;

public class AnalyticsDashboardResponse {
    private long totalComplaints;
    private long resolvedComplaints;
    private long pendingComplaints;
    private long breachedSlas;
    private double averageResolutionTimeHours;
    
    public AnalyticsDashboardResponse() {}

    public AnalyticsDashboardResponse(long totalComplaints, long resolvedComplaints, long pendingComplaints, long breachedSlas, double averageResolutionTimeHours) {
        this.totalComplaints = totalComplaints;
        this.resolvedComplaints = resolvedComplaints;
        this.pendingComplaints = pendingComplaints;
        this.breachedSlas = breachedSlas;
        this.averageResolutionTimeHours = averageResolutionTimeHours;
    }

    public long getTotalComplaints() { return totalComplaints; }
    public void setTotalComplaints(long totalComplaints) { this.totalComplaints = totalComplaints; }

    public long getResolvedComplaints() { return resolvedComplaints; }
    public void setResolvedComplaints(long resolvedComplaints) { this.resolvedComplaints = resolvedComplaints; }

    public long getPendingComplaints() { return pendingComplaints; }
    public void setPendingComplaints(long pendingComplaints) { this.pendingComplaints = pendingComplaints; }

    public long getBreachedSlas() { return breachedSlas; }
    public void setBreachedSlas(long breachedSlas) { this.breachedSlas = breachedSlas; }

    public double getAverageResolutionTimeHours() { return averageResolutionTimeHours; }
    public void setAverageResolutionTimeHours(double averageResolutionTimeHours) { this.averageResolutionTimeHours = averageResolutionTimeHours; }
}
