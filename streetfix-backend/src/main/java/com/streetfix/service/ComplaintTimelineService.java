package com.streetfix.service;

import com.streetfix.dto.ComplaintTimelineResponse;
import com.streetfix.enums.ComplaintStatus;

import java.util.List;

public interface ComplaintTimelineService {

    /** Add a new event to the complaint timeline */
    void addTimelineEntry(Long complaintId, ComplaintStatus status, String message, String createdBy);

    /** Get the full ordered timeline for a complaint */
    List<ComplaintTimelineResponse> getTimeline(Long complaintId);
}
