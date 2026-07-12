package com.streetfix.service;

import com.streetfix.dto.MessageResponse;
import com.streetfix.entity.Assignment;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface WorkerService {
    List<Assignment> getAssignedTasks(String workerEmail);
    MessageResponse acceptTask(Long assignmentId, String workerEmail);
    MessageResponse updateTaskProgress(Long assignmentId, String workerEmail, String note);
    MessageResponse markTaskComplete(Long assignmentId, String workerEmail, String note);
    MessageResponse uploadImages(Long assignmentId, String workerEmail, MultipartFile beforeImage, MultipartFile afterImage);
}
