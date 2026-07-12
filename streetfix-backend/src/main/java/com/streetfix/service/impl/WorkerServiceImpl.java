package com.streetfix.service.impl;

import com.streetfix.dto.MessageResponse;
import com.streetfix.entity.Assignment;
import com.streetfix.entity.Complaint;
import com.streetfix.entity.User;
import com.streetfix.entity.Worker;
import com.streetfix.enums.ComplaintStatus;
import com.streetfix.repository.AssignmentRepository;
import com.streetfix.repository.ComplaintRepository;
import com.streetfix.repository.UserRepository;
import com.streetfix.repository.WorkerRepository;
import com.streetfix.service.ComplaintTimelineService;
import com.streetfix.service.WorkerService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class WorkerServiceImpl implements WorkerService {

    private final AssignmentRepository assignmentRepository;
    private final WorkerRepository workerRepository;
    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final ComplaintTimelineService timelineService;

    public WorkerServiceImpl(AssignmentRepository assignmentRepository, WorkerRepository workerRepository,
                             UserRepository userRepository, ComplaintRepository complaintRepository,
                             ComplaintTimelineService timelineService) {
        this.assignmentRepository = assignmentRepository;
        this.workerRepository = workerRepository;
        this.userRepository = userRepository;
        this.complaintRepository = complaintRepository;
        this.timelineService = timelineService;
    }

    private Worker getWorkerByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return workerRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Worker not found"));
    }

    private Assignment getAssignmentForWorker(Long assignmentId, Worker worker) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        if (!assignment.getWorker().getId().equals(worker.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        return assignment;
    }

    @Override
    public List<Assignment> getAssignedTasks(String workerEmail) {
        Worker worker = getWorkerByEmail(workerEmail);
        // Note: You would normally add a method to AssignmentRepository to findByWorkerId.
        // Assuming AssignmentRepository.findAll() is fine for a hack or we add it. 
        // Let's add it to AssignmentRepository.
        return assignmentRepository.findByWorkerId(worker.getId());
    }

    @Override
    public MessageResponse acceptTask(Long assignmentId, String workerEmail) {
        Worker worker = getWorkerByEmail(workerEmail);
        Assignment assignment = getAssignmentForWorker(assignmentId, worker);
        Complaint complaint = assignment.getComplaint();
        
        complaint.setStatus(ComplaintStatus.ASSIGNED_TO_WORKER);
        complaintRepository.save(complaint);
        timelineService.addTimelineEntry(complaint.getId(), ComplaintStatus.ASSIGNED_TO_WORKER, "Task accepted by worker");
        
        return new MessageResponse("Task accepted successfully");
    }

    @Override
    public MessageResponse updateTaskProgress(Long assignmentId, String workerEmail, String note) {
        Worker worker = getWorkerByEmail(workerEmail);
        Assignment assignment = getAssignmentForWorker(assignmentId, worker);
        Complaint complaint = assignment.getComplaint();
        
        timelineService.addTimelineEntry(complaint.getId(), ComplaintStatus.ASSIGNED_TO_WORKER, "Progress Update: " + note);
        
        return new MessageResponse("Progress updated successfully");
    }

    @Override
    public MessageResponse markTaskComplete(Long assignmentId, String workerEmail, String note) {
        Worker worker = getWorkerByEmail(workerEmail);
        Assignment assignment = getAssignmentForWorker(assignmentId, worker);
        Complaint complaint = assignment.getComplaint();
        
        complaint.setStatus(ComplaintStatus.WORK_COMPLETED);
        complaintRepository.save(complaint);
        timelineService.addTimelineEntry(complaint.getId(), ComplaintStatus.WORK_COMPLETED, "Work completed. Note: " + note);
        
        return new MessageResponse("Task marked as complete");
    }

    @Override
    public MessageResponse uploadImages(Long assignmentId, String workerEmail, MultipartFile beforeImage, MultipartFile afterImage) {
        Worker worker = getWorkerByEmail(workerEmail);
        Assignment assignment = getAssignmentForWorker(assignmentId, worker);
        Complaint complaint = assignment.getComplaint();
        
        // In a real app we'd upload this to S3. Here we'll just mock it.
        if (beforeImage != null && !beforeImage.isEmpty()) {
            complaint.setBeforeImageUrl("uploaded_" + beforeImage.getOriginalFilename());
        }
        if (afterImage != null && !afterImage.isEmpty()) {
            complaint.setAfterImageUrl("uploaded_" + afterImage.getOriginalFilename());
        }
        complaintRepository.save(complaint);
        
        return new MessageResponse("Images uploaded successfully");
    }
}
