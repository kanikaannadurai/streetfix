package com.streetfix.controller;

import com.streetfix.dto.MessageResponse;
import com.streetfix.entity.Assignment;
import com.streetfix.service.WorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/worker/tasks")
@RequiredArgsConstructor
@PreAuthorize("hasRole('WORKER')")
public class WorkerController {

    private final WorkerService workerService;

    @GetMapping
    public ResponseEntity<List<Assignment>> getAssignedTasks(Principal principal) {
        return ResponseEntity.ok(workerService.getAssignedTasks(principal.getName()));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<MessageResponse> acceptTask(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(workerService.acceptTask(id, principal.getName()));
    }

    @PutMapping("/{id}/progress")
    public ResponseEntity<MessageResponse> updateProgress(@PathVariable Long id, 
                                                          @RequestParam String note, 
                                                          Principal principal) {
        return ResponseEntity.ok(workerService.updateTaskProgress(id, principal.getName(), note));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<MessageResponse> completeTask(@PathVariable Long id, 
                                                        @RequestParam String note, 
                                                        Principal principal) {
        return ResponseEntity.ok(workerService.markTaskComplete(id, principal.getName(), note));
    }

    @PostMapping("/{id}/upload")
    public ResponseEntity<MessageResponse> uploadImages(@PathVariable Long id, 
                                                        @RequestParam(required = false) MultipartFile beforeImage, 
                                                        @RequestParam(required = false) MultipartFile afterImage, 
                                                        Principal principal) {
        return ResponseEntity.ok(workerService.uploadImages(id, principal.getName(), beforeImage, afterImage));
    }
}
