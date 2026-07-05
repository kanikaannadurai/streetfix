package com.streetfix.service.impl;

import com.streetfix.entity.User;
import com.streetfix.enums.ComplaintStatus;
import com.streetfix.repository.ComplaintRepository;
import com.streetfix.repository.UserRepository;
import com.streetfix.service.DashboardService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public DashboardServiceImpl(ComplaintRepository complaintRepository, UserRepository userRepository) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Map<String, Object> getAdminDashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalComplaints", complaintRepository.count());
        stats.put("resolvedComplaints", complaintRepository.findByStatus(ComplaintStatus.RESOLVED).size());
        stats.put("pendingComplaints", complaintRepository.findByStatus(ComplaintStatus.PENDING).size());
        stats.put("totalUsers", userRepository.count());
        return stats;
    }

    @Override
    public Map<String, Object> getOfficerDashboard(String email) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("assignedComplaints", complaintRepository.findByStatus(ComplaintStatus.ASSIGNED).size());
        stats.put("inProgressComplaints", complaintRepository.findByStatus(ComplaintStatus.IN_PROGRESS).size());
        return stats;
    }

    @Override
    public Map<String, Object> getCitizenDashboard(String email) {
        User citizen = userRepository.findByEmail(email).orElseThrow();
        Map<String, Object> stats = new HashMap<>();
        stats.put("myComplaints", complaintRepository.findByCitizenId(citizen.getId()).size());
        return stats;
    }
}
