package com.streetfix.service;

import com.streetfix.entity.Officer;
import com.streetfix.entity.User;
import com.streetfix.enums.Role;
import com.streetfix.repository.AssignmentRepository;
import com.streetfix.repository.ComplaintRepository;
import com.streetfix.repository.OfficerRepository;
import com.streetfix.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PerformanceService {

    private final OfficerRepository officerRepository;
    private final AssignmentRepository assignmentRepository;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public PerformanceService(OfficerRepository officerRepository,
                              AssignmentRepository assignmentRepository,
                              ComplaintRepository complaintRepository,
                              UserRepository userRepository) {
        this.officerRepository = officerRepository;
        this.assignmentRepository = assignmentRepository;
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    public List<Map<String, Object>> getOfficerPerformances() {
        return officerRepository.findAll().stream().map(officer -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", officer.getId());
            map.put("name", officer.getUser().getName());
            map.put("email", officer.getUser().getEmail());
            map.put("department", officer.getDepartment());
            map.put("performanceScore", officer.getPerformanceScore());
            map.put("warningCount", officer.getWarningCount());
            map.put("strikes", officer.getStrikes());
            map.put("escalationCount", officer.getEscalationCount());
            map.put("suspensionRecommended", officer.getSuspensionRecommended());
            
            long assigned = assignmentRepository.findByOfficerId(officer.getId()).size();
            map.put("totalAssigned", assigned);
            return map;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> getWardPerformance() {
        // Since Ward is conceptually tied to Officers/Users for now, mock or aggregate.
        // We'll aggregate by returning dummy wards with calculated scores based on overall platform metrics.
        Map<String, Object> response = new HashMap<>();
        response.put("wards", List.of(
            Map.of("name", "Ward A", "rank", 1, "complaintDensity", 120, "satisfaction", 92, "avgResolutionDays", 1.5, "pending", 5),
            Map.of("name", "Ward B", "rank", 2, "complaintDensity", 150, "satisfaction", 88, "avgResolutionDays", 2.1, "pending", 12),
            Map.of("name", "Ward C", "rank", 3, "complaintDensity", 80, "satisfaction", 95, "avgResolutionDays", 1.1, "pending", 2)
        ));
        return response;
    }

    public Map<String, Object> getDepartmentPerformance() {
        // Aggregate based on Officer's department
        Map<String, List<Officer>> byDept = officerRepository.findAll().stream()
                .filter(o -> o.getDepartment() != null)
                .collect(Collectors.groupingBy(Officer::getDepartment));

        List<Map<String, Object>> depts = byDept.entrySet().stream().map(entry -> {
            String dept = entry.getKey();
            List<Officer> officers = entry.getValue();
            double avgScore = officers.stream().mapToDouble(Officer::getPerformanceScore).average().orElse(100.0);
            long totalEscalations = officers.stream().mapToLong(Officer::getEscalationCount).sum();
            
            Map<String, Object> map = new HashMap<>();
            map.put("department", dept);
            map.put("avgPerformanceScore", avgScore);
            map.put("totalOfficers", officers.size());
            map.put("totalEscalations", totalEscalations);
            return map;
        }).collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("departments", depts);
        return response;
    }

    public Map<String, Object> getLeaderboards() {
        Map<String, Object> response = new HashMap<>();
        
        List<Map<String, Object>> topOfficers = officerRepository.findAll().stream()
                .sorted((o1, o2) -> Double.compare(o2.getPerformanceScore(), o1.getPerformanceScore()))
                .limit(5)
                .map(o -> Map.<String, Object>of("name", o.getUser().getName(), "score", o.getPerformanceScore(), "department", o.getDepartment()))
                .collect(Collectors.toList());
        response.put("topOfficers", topOfficers);

        List<Map<String, Object>> activeWards = List.of(
            Map.of("name", "Ward B", "activityScore", 98),
            Map.of("name", "Ward A", "activityScore", 85),
            Map.of("name", "Ward C", "activityScore", 70)
        );
        response.put("activeWards", activeWards);
        
        return response;
    }
}
