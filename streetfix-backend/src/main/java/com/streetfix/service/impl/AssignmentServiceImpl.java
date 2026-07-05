package com.streetfix.service.impl;

import com.streetfix.dto.AssignmentRequest;
import com.streetfix.dto.MessageResponse;
import com.streetfix.entity.Assignment;
import com.streetfix.entity.Complaint;
import com.streetfix.entity.Officer;
import com.streetfix.entity.Worker;
import com.streetfix.enums.ComplaintStatus;
import com.streetfix.repository.AssignmentRepository;
import com.streetfix.repository.ComplaintRepository;
import com.streetfix.repository.OfficerRepository;
import com.streetfix.repository.WorkerRepository;
import com.streetfix.service.AssignmentService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssignmentServiceImpl implements AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final ComplaintRepository complaintRepository;
    private final OfficerRepository officerRepository;
    private final WorkerRepository workerRepository;

    public AssignmentServiceImpl(AssignmentRepository assignmentRepository,
                                 ComplaintRepository complaintRepository,
                                 OfficerRepository officerRepository,
                                 WorkerRepository workerRepository) {
        this.assignmentRepository = assignmentRepository;
        this.complaintRepository = complaintRepository;
        this.officerRepository = officerRepository;
        this.workerRepository = workerRepository;
    }

    @Override
    public MessageResponse assignComplaint(AssignmentRequest request) {
        Complaint complaint = complaintRepository.findById(request.getComplaintId())
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        Officer officer = null;
        Worker worker = null;

        if (request.getOfficerId() != null) {
            officer = officerRepository.findById(request.getOfficerId()).orElse(null);
            complaint.setStatus(ComplaintStatus.ASSIGNED);
        }

        if (request.getWorkerId() != null) {
            worker = workerRepository.findById(request.getWorkerId()).orElse(null);
            complaint.setStatus(ComplaintStatus.ASSIGNED);
        }

        Assignment assignment = Assignment.builder()
                .complaint(complaint)
                .officer(officer)
                .worker(worker)
                .build();

        assignmentRepository.save(assignment);
        complaintRepository.save(complaint);

        return new MessageResponse("Assignment created successfully");
    }

    @Override
    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    @Override
    public MessageResponse updateAssignment(Long id, AssignmentRequest request) {
        Assignment assignment = assignmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Assignment not found"));

        if (request.getOfficerId() != null) {
            Officer officer = officerRepository.findById(request.getOfficerId()).orElse(null);
            assignment.setOfficer(officer);
        }

        if (request.getWorkerId() != null) {
            Worker worker = workerRepository.findById(request.getWorkerId()).orElse(null);
            assignment.setWorker(worker);
        }

        assignmentRepository.save(assignment);
        return new MessageResponse("Assignment updated successfully");
    }
}
