package com.streetfix.service;

import com.streetfix.dto.MessageResponse;
import com.streetfix.entity.Complaint;
import com.streetfix.entity.User;
import com.streetfix.enums.ComplaintStatus;
import com.streetfix.enums.Role;
import com.streetfix.repository.ComplaintRepository;
import com.streetfix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkflowService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public MessageResponse assignToWardSupervisor(Long complaintId, Long wsId) {
        Complaint complaint = getComplaint(complaintId);
        User ws = getUser(wsId, Role.ROLE_WARD_SUPERVISOR);
        
        complaint.setWardSupervisor(ws);
        complaint.setStatus(ComplaintStatus.ASSIGNED_TO_WARD_SUPERVISOR);
        complaintRepository.save(complaint);
        
        notificationService.createNotificationForUser(ws.getId(), Role.ROLE_WARD_SUPERVISOR.name(), complaint.getId(),
                "New Assignment", "A new complaint has been assigned to you.");
        return new MessageResponse("Complaint assigned to Ward Supervisor successfully.");
    }

    public MessageResponse assignToWorker(Long complaintId, Long workerId) {
        Complaint complaint = getComplaint(complaintId);
        User worker = getUser(workerId, Role.ROLE_WORKER);
        
        complaint.setWorker(worker);
        complaint.setStatus(ComplaintStatus.ASSIGNED_TO_WORKER);
        complaintRepository.save(complaint);
        
        notificationService.createNotificationForUser(worker.getId(), Role.ROLE_WORKER.name(), complaint.getId(),
                "New Assignment", "A new complaint has been assigned to you for fieldwork.");
        return new MessageResponse("Complaint assigned to Worker successfully.");
    }

    public MessageResponse markWorkCompleted(Long complaintId) {
        Complaint complaint = getComplaint(complaintId);
        complaint.setStatus(ComplaintStatus.WORK_COMPLETED);
        complaintRepository.save(complaint);
        
        if (complaint.getWardSupervisor() != null) {
            notificationService.createNotificationForUser(complaint.getWardSupervisor().getId(), Role.ROLE_WARD_SUPERVISOR.name(), complaint.getId(),
                    "Work Completed", "Worker has marked the work as completed. Please verify.");
        }
        return new MessageResponse("Work marked as completed successfully.");
    }

    public MessageResponse verifyByWardSupervisor(Long complaintId, boolean approved, String remarks) {
        Complaint complaint = getComplaint(complaintId);
        if (approved) {
            complaint.setStatus(ComplaintStatus.RESOLVED);
            notificationService.createNotificationForRole(Role.ROLE_ADMIN, complaint.getId(),
                    "Complaint Resolved", "A complaint has been fully resolved and verified.");
            notificationService.createNotificationForUser(complaint.getCitizen().getId(), Role.ROLE_CITIZEN.name(), complaint.getId(),
                    "Complaint Resolved", "Your complaint has been successfully resolved.");
        } else {
            complaint.setStatus(ComplaintStatus.ASSIGNED_TO_WORKER);
            if (complaint.getWorker() != null) {
                notificationService.createNotificationForUser(complaint.getWorker().getId(), Role.ROLE_WORKER.name(), complaint.getId(),
                        "Work Rejected", "Ward Supervisor has rejected the work with remarks: " + remarks);
            }
        }
        complaintRepository.save(complaint);
        return new MessageResponse(approved ? "Work verified and complaint resolved." : "Work rejected and sent back to worker.");
    }

    private Complaint getComplaint(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + id));
    }

    private User getUser(Long id, Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(role.name() + " not found with ID: " + id));
        if (user.getRole() != role) {
            throw new RuntimeException("User is not a " + role.name());
        }
        return user;
    }
}
