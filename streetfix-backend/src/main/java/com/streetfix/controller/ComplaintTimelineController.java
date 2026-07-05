package com.streetfix.controller;

import com.streetfix.dto.ComplaintTimelineResponse;
import com.streetfix.service.ComplaintTimelineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for the complaint timeline / history view.
 *
 * Any authenticated user can view the full lifecycle of a complaint
 * they are involved with.
 */
@RestController
@RequestMapping("/api/complaints/{complaintId}/timeline")
@RequiredArgsConstructor
public class ComplaintTimelineController {

    private final ComplaintTimelineService timelineService;

    /**
     * Returns the full chronological timeline for a complaint.
     * Shows every state transition from submission to closure.
     */
    @GetMapping
    public ResponseEntity<List<ComplaintTimelineResponse>> getTimeline(@PathVariable Long complaintId) {
        return ResponseEntity.ok(timelineService.getTimeline(complaintId));
    }
}
