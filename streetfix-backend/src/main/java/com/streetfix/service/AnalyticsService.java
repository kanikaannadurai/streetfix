package com.streetfix.service;

import com.streetfix.dto.AnalyticsDashboardResponse;
import com.streetfix.enums.ComplaintStatus;
import com.streetfix.enums.SlaStatus;
import com.streetfix.repository.ComplaintRepository;
import com.streetfix.repository.ComplaintSlaRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class AnalyticsService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintSlaRepository complaintSlaRepository;

    public AnalyticsService(ComplaintRepository complaintRepository, ComplaintSlaRepository complaintSlaRepository) {
        this.complaintRepository = complaintRepository;
        this.complaintSlaRepository = complaintSlaRepository;
    }

    @Cacheable("analytics")
    public AnalyticsDashboardResponse getDashboardStats() {
        long totalComplaints = complaintRepository.count();
        long resolvedComplaints = complaintRepository.findByStatus(ComplaintStatus.RESOLVED).size() +
                                  complaintRepository.findByStatus(ComplaintStatus.CLOSED).size();
        long pendingComplaints = totalComplaints - resolvedComplaints;
        
        long breachedSlas = complaintSlaRepository.findByStatus(SlaStatus.BREACHED).size();
        
        // Calculate average resolution time
        AtomicLong totalHours = new AtomicLong(0);
        AtomicLong count = new AtomicLong(0);
        
        complaintRepository.findAll().stream()
            .filter(c -> c.getStatus() == ComplaintStatus.RESOLVED || c.getStatus() == ComplaintStatus.CLOSED)
            .forEach(c -> {
                if (c.getCreatedAt() != null && c.getUpdatedAt() != null) {
                    long hours = Duration.between(c.getCreatedAt(), c.getUpdatedAt()).toHours();
                    totalHours.addAndGet(hours);
                    count.incrementAndGet();
                }
            });
            
        double avgTime = count.get() > 0 ? (double) totalHours.get() / count.get() : 0.0;
        
        return new AnalyticsDashboardResponse(totalComplaints, resolvedComplaints, pendingComplaints, breachedSlas, avgTime);
    }
}
