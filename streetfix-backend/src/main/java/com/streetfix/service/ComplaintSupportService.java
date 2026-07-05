package com.streetfix.service;

import com.streetfix.dto.MessageResponse;
import com.streetfix.entity.Complaint;
import com.streetfix.entity.ComplaintSupport;
import com.streetfix.entity.User;
import com.streetfix.repository.ComplaintRepository;
import com.streetfix.repository.ComplaintSupportRepository;
import com.streetfix.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class ComplaintSupportService {

    private final ComplaintSupportRepository supportRepository;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public ComplaintSupportService(ComplaintSupportRepository supportRepository,
                                   ComplaintRepository complaintRepository,
                                   UserRepository userRepository) {
        this.supportRepository = supportRepository;
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    public MessageResponse supportComplaint(Long complaintId, String citizenEmail) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        User citizen = userRepository.findByEmail(citizenEmail)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));

        if (supportRepository.findByComplaintIdAndCitizenId(complaintId, citizen.getId()).isPresent()) {
            throw new RuntimeException("You have already supported this complaint");
        }

        ComplaintSupport support = ComplaintSupport.builder()
                .complaint(complaint)
                .citizen(citizen)
                .build();
        supportRepository.save(support);

        // Ideally, if support count crosses a threshold, we can boost priority here.

        return new MessageResponse("Successfully supported complaint");
    }

    public long getSupportCount(Long complaintId) {
        return supportRepository.countByComplaintId(complaintId);
    }
}
