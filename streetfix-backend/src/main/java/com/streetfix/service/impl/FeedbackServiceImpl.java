package com.streetfix.service.impl;

import com.streetfix.dto.FeedbackRequest;
import com.streetfix.dto.MessageResponse;
import com.streetfix.entity.Complaint;
import com.streetfix.entity.Feedback;
import com.streetfix.enums.ComplaintStatus;
import com.streetfix.repository.ComplaintRepository;
import com.streetfix.repository.FeedbackRepository;
import com.streetfix.service.FeedbackService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ComplaintRepository complaintRepository;

    public FeedbackServiceImpl(FeedbackRepository feedbackRepository, ComplaintRepository complaintRepository) {
        this.feedbackRepository = feedbackRepository;
        this.complaintRepository = complaintRepository;
    }

    @Override
    public MessageResponse submitFeedback(FeedbackRequest request) {
        Complaint complaint = complaintRepository.findById(request.getComplaintId())
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (complaint.getStatus() != ComplaintStatus.RESOLVED && complaint.getStatus() != ComplaintStatus.CLOSED) {
            throw new RuntimeException("Feedback can only be submitted for resolved complaints");
        }

        if (feedbackRepository.findByComplaintId(request.getComplaintId()).isPresent()) {
            throw new RuntimeException("Feedback already submitted for this complaint");
        }

        Feedback feedback = Feedback.builder()
                .complaint(complaint)
                .rating(request.getRating())
                .comments(request.getComments())
                .build();

        feedbackRepository.save(feedback);

        complaint.setStatus(ComplaintStatus.CLOSED);
        complaintRepository.save(complaint);

        return new MessageResponse("Feedback submitted successfully");
    }

    @Override
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }
}
