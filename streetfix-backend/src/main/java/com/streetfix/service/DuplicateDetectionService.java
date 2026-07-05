package com.streetfix.service;

import com.streetfix.dto.DuplicateComplaintResponse;
import com.streetfix.entity.Complaint;
import com.streetfix.enums.ComplaintStatus;
import com.streetfix.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Service to detect potential duplicate complaints.
 * Uses Haversine distance and simple Jaccard similarity for description text.
 */
@Service
public class DuplicateDetectionService {

    private static final int EARTH_RADIUS_METERS = 6371000;
    private static final double DUPLICATE_RADIUS_METERS = 50.0;
    private static final double SIMILARITY_THRESHOLD = 0.4;

    private final ComplaintRepository complaintRepository;

    public DuplicateDetectionService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    /**
     * Finds potential duplicates for a given new complaint.
     */
    public List<DuplicateComplaintResponse> findPotentialDuplicates(String category, String title, String description, Double lat, Double lon) {
        List<DuplicateComplaintResponse> duplicates = new ArrayList<>();
        
        if (lat == null || lon == null) {
            return duplicates;
        }

        // Only compare against active complaints
        List<Complaint> activeComplaints = new ArrayList<>();
        activeComplaints.addAll(complaintRepository.findByStatus(ComplaintStatus.PENDING));
        activeComplaints.addAll(complaintRepository.findByStatus(ComplaintStatus.ASSIGNED));
        activeComplaints.addAll(complaintRepository.findByStatus(ComplaintStatus.ACCEPTED));
        activeComplaints.addAll(complaintRepository.findByStatus(ComplaintStatus.IN_PROGRESS));

        for (Complaint existing : activeComplaints) {
            if (existing.getLatitude() == null || existing.getLongitude() == null) {
                continue;
            }

            double distance = calculateHaversineDistance(lat, lon, existing.getLatitude(), existing.getLongitude());
            
            if (distance <= DUPLICATE_RADIUS_METERS) {
                boolean sameCategory = category != null && category.equals(existing.getCategory());
                double similarity = calculateJaccardSimilarity(title + " " + description, existing.getTitle() + " " + existing.getDescription());
                
                if (sameCategory || similarity >= SIMILARITY_THRESHOLD) {
                    duplicates.add(DuplicateComplaintResponse.builder()
                            .id(existing.getId())
                            .title(existing.getTitle())
                            .category(existing.getCategory())
                            .similarityScore(similarity)
                            .distanceMeters(distance)
                            .build());
                }
            }
        }

        return duplicates;
    }

    /**
     * Calculates the distance between two coordinates in meters using the Haversine formula.
     */
    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_METERS * c;
    }

    /**
     * Calculates Jaccard similarity between two strings based on word tokens.
     */
    private double calculateJaccardSimilarity(String text1, String text2) {
        if (text1 == null || text2 == null) return 0.0;
        
        Set<String> set1 = new HashSet<>(Arrays.asList(text1.toLowerCase().split("\\W+")));
        Set<String> set2 = new HashSet<>(Arrays.asList(text2.toLowerCase().split("\\W+")));

        if (set1.isEmpty() && set2.isEmpty()) return 1.0;

        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);

        return (double) intersection.size() / union.size();
    }
}
