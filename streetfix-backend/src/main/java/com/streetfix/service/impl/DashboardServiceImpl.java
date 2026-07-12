package com.streetfix.service.impl;

import com.streetfix.entity.User;
import com.streetfix.enums.ComplaintStatus;
import com.streetfix.repository.ComplaintRepository;
import com.streetfix.repository.UserRepository;
import com.streetfix.service.DashboardService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

import com.streetfix.entity.Officer;
import com.streetfix.repository.OfficerRepository;
import com.streetfix.entity.Assignment;
import com.streetfix.repository.AssignmentRepository;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final OfficerRepository officerRepository;
    private final AssignmentRepository assignmentRepository;

    public DashboardServiceImpl(ComplaintRepository complaintRepository, UserRepository userRepository, OfficerRepository officerRepository, AssignmentRepository assignmentRepository) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
        this.officerRepository = officerRepository;
        this.assignmentRepository = assignmentRepository;
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
        User user = userRepository.findByEmail(email).orElseThrow();
        Officer officer = officerRepository.findByUserId(user.getId()).orElse(null);
        Map<String, Object> stats = new HashMap<>();
        if (officer != null) {
            java.util.List<Assignment> assignments = assignmentRepository.findByOfficerId(officer.getId());
            long assigned = assignments.stream().filter(a -> a.getComplaint().getStatus() != ComplaintStatus.RESOLVED && a.getComplaint().getStatus() != ComplaintStatus.WORK_COMPLETED).count();
            long inProgress = assignments.stream().filter(a -> a.getComplaint().getStatus() == ComplaintStatus.WORK_COMPLETED).count();
            stats.put("assignedComplaints", assigned);
            stats.put("inProgressComplaints", inProgress);
        } else {
            stats.put("assignedComplaints", 0);
            stats.put("inProgressComplaints", 0);
        }
        return stats;
    }

    @Override
    public Map<String, Object> getCitizenDashboard(String email) {
        User citizen = userRepository.findByEmail(email).orElseThrow();
        Map<String, Object> stats = new HashMap<>();
        
        java.util.List<com.streetfix.entity.Complaint> complaints = complaintRepository.findByCitizenId(citizen.getId());
        long total = complaints.size();
        long resolved = complaints.stream().filter(c -> c.getStatus() == ComplaintStatus.RESOLVED || c.getStatus() == ComplaintStatus.WORK_COMPLETED).count();
        long pending = complaints.stream().filter(c -> c.getStatus() == ComplaintStatus.PENDING).count();
        long inProgress = total - resolved - pending;

        stats.put("total", total);
        stats.put("resolved", resolved);
        stats.put("pending", pending);
        stats.put("inProgress", inProgress);
        return stats;
    }
}
