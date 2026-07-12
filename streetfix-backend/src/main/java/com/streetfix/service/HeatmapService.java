package com.streetfix.service;

import com.streetfix.dto.HeatmapPointResponse;
import com.streetfix.entity.Complaint;
import com.streetfix.enums.ComplaintStatus;
import com.streetfix.repository.ComplaintRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HeatmapService {

    private final ComplaintRepository complaintRepository;

    public HeatmapService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    @Cacheable("heatmaps")
    public List<HeatmapPointResponse> generateHeatmapData() {
        List<Complaint> activeComplaints = new ArrayList<>();
        activeComplaints.addAll(complaintRepository.findByStatus(ComplaintStatus.PENDING));
        activeComplaints.addAll(complaintRepository.findByStatus(ComplaintStatus.ASSIGNED_TO_ZONAL_OFFICER));
        activeComplaints.addAll(complaintRepository.findByStatus(ComplaintStatus.ASSIGNED_TO_ASSISTANT_COMMISSIONER));
        activeComplaints.addAll(complaintRepository.findByStatus(ComplaintStatus.ASSIGNED_TO_WARD_SUPERVISOR));
        activeComplaints.addAll(complaintRepository.findByStatus(ComplaintStatus.ASSIGNED_TO_WORKER));
        activeComplaints.addAll(complaintRepository.findByStatus(ComplaintStatus.WORK_COMPLETED));
        activeComplaints.addAll(complaintRepository.findByStatus(ComplaintStatus.VERIFIED_BY_WARD_SUPERVISOR));
        activeComplaints.addAll(complaintRepository.findByStatus(ComplaintStatus.APPROVED_BY_ASSISTANT_COMMISSIONER));
        activeComplaints.addAll(complaintRepository.findByStatus(ComplaintStatus.APPROVED_BY_ZONAL_OFFICER));

        Map<String, HeatmapPointResponse> pointMap = new HashMap<>();

        for (Complaint c : activeComplaints) {
            if (c.getLatitude() != null && c.getLongitude() != null) {
                // Round coordinates slightly to group nearby complaints
                double roundedLat = Math.round(c.getLatitude() * 1000.0) / 1000.0;
                double roundedLon = Math.round(c.getLongitude() * 1000.0) / 1000.0;
                
                String key = roundedLat + "," + roundedLon;
                
                int priorityWeight = 1;
                if (c.getPriority() != null) {
                    priorityWeight = switch (c.getPriority()) {
                        case CRITICAL -> 10;
                        case HIGH -> 5;
                        case MEDIUM -> 2;
                        case LOW -> 1;
                    };
                }

                if (pointMap.containsKey(key)) {
                    HeatmapPointResponse point = pointMap.get(key);
                    point.setIntensity(point.getIntensity() + priorityWeight);
                } else {
                    pointMap.put(key, new HeatmapPointResponse(roundedLat, roundedLon, priorityWeight));
                }
            }
        }

        return new ArrayList<>(pointMap.values());
    }
}
