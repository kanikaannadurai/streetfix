package com.streetfix.service;

import com.streetfix.dto.FeedbackRequest;
import com.streetfix.dto.MessageResponse;
import com.streetfix.entity.Feedback;

import java.util.List;

public interface FeedbackService {
    MessageResponse submitFeedback(FeedbackRequest request);
    List<Feedback> getAllFeedback();
}
