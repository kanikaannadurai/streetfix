package com.streetfix.service;

import com.streetfix.dto.AnalyticsDashboardResponse;
import com.streetfix.enums.ComplaintStatus;
import com.streetfix.enums.Role;
import com.streetfix.enums.SlaStatus;
import com.streetfix.repository.ComplaintRepository;
import com.streetfix.repository.ComplaintSlaRepository;
import com.streetfix.repository.EscalationLogRepository;
import com.streetfix.repository.UserRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintSlaRepository complaintSlaRepository;
    private final UserRepository userRepository;
    private final EscalationLogRepository escalationLogRepository;

    public AnalyticsService(ComplaintRepository complaintRepository,
                             ComplaintSlaRepository complaintSlaRepository,
                             UserRepository userRepository,
                             EscalationLogRepository escalationLogRepository) {
        this.complaintRepository = complaintRepository;
        this.complaintSlaRepository = complaintSlaRepository;
        this.userRepository = userRepository;
        this.escalationLogRepository = escalationLogRepository;
    }

    @Cacheable("analytics")
    public AnalyticsDashboardResponse getDashboardStats() {
        long totalComplaints = complaintRepository.count();
        long resolvedComplaints = complaintRepository.findByStatus(ComplaintStatus.RESOLVED).size() +
                                  complaintRepository.findByStatus(ComplaintStatus.CLOSED).size();
        long pendingComplaints = totalComplaints - resolvedComplaints;
        
        long breachedSlas = complaintSlaRepository.findByStatus(SlaStatus.BREACHED).size();
        
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

    public Map<String, Object> getCategoryAnalytics() {
        Map<String, Object> result = new LinkedHashMap<>();
        List<Object[]> rows = complaintRepository.countGroupByCategory();
        Map<String, Long> categoryMap = new LinkedHashMap<>();
        for (Object[] row : rows) {
            categoryMap.put((String) row[0], (Long) row[1]);
        }
        result.put("byCategory", categoryMap);
        result.put("totalCategories", categoryMap.size());
        return result;
    }

    public Map<String, Object> getPriorityAnalytics() {
        Map<String, Object> result = new LinkedHashMap<>();
        List<Object[]> rows = complaintRepository.countGroupByPriority();
        Map<String, Long> priorityMap = new LinkedHashMap<>();
        for (Object[] row : rows) {
            priorityMap.put(row[0].toString(), (Long) row[1]);
        }
        result.put("byPriority", priorityMap);
        return result;
    }

    public Map<String, Object> getStatusAnalytics() {
        Map<String, Object> result = new LinkedHashMap<>();
        List<Object[]> rows = complaintRepository.countGroupByStatus();
        Map<String, Long> statusMap = new LinkedHashMap<>();
        for (Object[] row : rows) {
            statusMap.put(row[0].toString(), (Long) row[1]);
        }
        result.put("byStatus", statusMap);
        return result;
    }

    public Map<String, Object> getTrendAnalytics(int days) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<Map<String, Object>> trend = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (int i = days - 1; i >= 0; i--) {
            LocalDateTime from = now.minusDays(i).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime to = from.withHour(23).withMinute(59).withSecond(59);
            long count = complaintRepository.countByCreatedAtBetween(from, to);
            Map<String, Object> point = new LinkedHashMap<>();
            point.put("date", from.toLocalDate().toString());
            point.put("count", count);
            trend.add(point);
        }
        result.put("trend", trend);
        result.put("days", days);
        return result;
    }

    public Map<String, Object> getUserAnalytics() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalUsers", userRepository.count());
        result.put("citizens", userRepository.countByRole(Role.ROLE_CITIZEN));
        result.put("officers", userRepository.countByRole(Role.ROLE_OFFICER));
        result.put("workers", userRepository.countByRole(Role.ROLE_WORKER));
        result.put("wardSupervisors", userRepository.countByRole(Role.ROLE_WARD_SUPERVISOR));
        result.put("admins", userRepository.countByRole(Role.ROLE_ADMIN));
        result.put("escalations", escalationLogRepository.count());
        return result;
    }

    public Map<String, Object> getSlaAnalytics() {
        Map<String, Object> result = new LinkedHashMap<>();
        long total = complaintSlaRepository.count();
        long breached = complaintSlaRepository.findByStatus(SlaStatus.BREACHED).size();
        long compliant = total - breached;
        result.put("totalTracked", total);
        result.put("breached", breached);
        result.put("compliant", compliant);
        result.put("breachRate", total > 0 ? Math.round(((double) breached / total) * 100) : 0);
        return result;
    }
}
