package com.streetfix.service.impl;

import com.streetfix.dto.ComplaintTimelineResponse;
import com.streetfix.entity.Complaint;
import com.streetfix.entity.ComplaintTimeline;
import com.streetfix.enums.ComplaintStatus;
import com.streetfix.repository.ComplaintRepository;
import com.streetfix.repository.ComplaintTimelineRepository;
import com.streetfix.service.ComplaintTimelineService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ComplaintTimelineServiceImpl implements ComplaintTimelineService {

    private final ComplaintTimelineRepository timelineRepository;
    private final ComplaintRepository complaintRepository;

    public ComplaintTimelineServiceImpl(ComplaintTimelineRepository timelineRepository,
                                        ComplaintRepository complaintRepository) {
        this.timelineRepository = timelineRepository;
        this.complaintRepository = complaintRepository;
    }

    @Override
    public void addTimelineEntry(Long complaintId, ComplaintStatus status, String message, String createdBy) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found: " + complaintId));

        ComplaintTimeline entry = ComplaintTimeline.builder()
                .complaint(complaint)
                .status(status)
                .message(message)
                .createdBy(createdBy)
                .build();

        timelineRepository.save(entry);
    }

    @Override
    public List<ComplaintTimelineResponse> getTimeline(Long complaintId) {
        return timelineRepository.findByComplaintIdOrderByCreatedAtAsc(complaintId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private ComplaintTimelineResponse toResponse(ComplaintTimeline entry) {
        return ComplaintTimelineResponse.builder()
                .id(entry.getId())
                .complaintId(entry.getComplaint().getId())
                .status(entry.getStatus())
                .statusLabel(formatStatusLabel(entry.getStatus()))
                .message(entry.getMessage())
                .createdBy(entry.getCreatedBy())
                .createdAt(entry.getCreatedAt())
                .build();
    }

    /** Convert enum to user-friendly display label */
    private String formatStatusLabel(ComplaintStatus status) {
        return switch (status) {
            case PENDING             -> "Complaint Submitted";
            case ASSIGNED            -> "Assigned to Officer";
            case ACCEPTED            -> "Accepted by Officer";
            case IN_PROGRESS         -> "Work In Progress";
            case RESOLVED            -> "Work Completed";
            case CITIZEN_VERIFICATION -> "Awaiting Citizen Verification";
            case CLOSED              -> "Complaint Closed";
        };
    }
}
