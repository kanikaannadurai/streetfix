package com.streetfix.service.impl;

import com.streetfix.dto.PublicDashboardResponse;
import com.streetfix.entity.Complaint;
import com.streetfix.enums.ComplaintStatus;
import com.streetfix.repository.ComplaintRepository;
import com.streetfix.service.PublicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PublicServiceImpl implements PublicService {

    private final ComplaintRepository complaintRepository;

    @Override
    public PublicDashboardResponse getPublicDashboardStats() {
        List<Complaint> allComplaints = complaintRepository.findAll();
        
        long total = allComplaints.size();
        
        long resolved = allComplaints.stream()
                .filter(c -> c.getStatus() == ComplaintStatus.RESOLVED || c.getStatus() == ComplaintStatus.APPROVED_BY_ZONAL_OFFICER || c.getStatus() == ComplaintStatus.APPROVED_BY_ASSISTANT_COMMISSIONER || c.getStatus() == ComplaintStatus.VERIFIED_BY_WARD_SUPERVISOR || c.getStatus() == ComplaintStatus.WORK_COMPLETED)
                .count();
                
        long pending = allComplaints.stream()
                .filter(c -> c.getStatus() == ComplaintStatus.PENDING || c.getStatus() == ComplaintStatus.ASSIGNED_TO_ZONAL_OFFICER || c.getStatus() == ComplaintStatus.ASSIGNED_TO_ASSISTANT_COMMISSIONER || c.getStatus() == ComplaintStatus.ASSIGNED_TO_WARD_SUPERVISOR || c.getStatus() == ComplaintStatus.ASSIGNED_TO_WORKER)
                .count();

        Map<String, Long> categoryStats = allComplaints.stream()
                .collect(Collectors.groupingBy(
                        Complaint::getCategory,
                        Collectors.counting()
                ));

        Map<String, Long> wardStats = new HashMap<>();
        wardStats.put("North Ward", 0L);
        wardStats.put("South Ward", 0L);
        wardStats.put("East Ward", 0L);
        wardStats.put("West Ward", 0L);
        wardStats.put("Central Ward", 0L);

        return PublicDashboardResponse.builder()
                .totalComplaints(total)
                .resolvedComplaints(resolved)
                .pendingComplaints(pending)
                .categoryStats(categoryStats)
                .wardStats(wardStats)
                .build();
    }
}
