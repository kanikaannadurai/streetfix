package com.streetfix.service;

import com.streetfix.dto.AssignmentRequest;
import com.streetfix.dto.MessageResponse;
import com.streetfix.entity.Assignment;

import java.util.List;

public interface AssignmentService {
    MessageResponse assignComplaint(AssignmentRequest request);
    List<Assignment> getAllAssignments();
    MessageResponse updateAssignment(Long id, AssignmentRequest request);
}
