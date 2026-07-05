package com.streetfix.controller;

import com.streetfix.dto.MessageResponse;
import com.streetfix.service.ComplaintSupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

/**
 * Controller for community verification (citizens supporting existing complaints).
 */
@RestController
@RequestMapping("/api/complaints/{complaintId}/support")
@RequiredArgsConstructor
public class ComplaintSupportController {

    private final ComplaintSupportService supportService;

    @PostMapping
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<MessageResponse> supportComplaint(@PathVariable Long complaintId, Principal principal) {
        return ResponseEntity.ok(supportService.supportComplaint(complaintId, principal.getName()));
    }

    @GetMapping
    public ResponseEntity<Long> getSupportCount(@PathVariable Long complaintId) {
        return ResponseEntity.ok(supportService.getSupportCount(complaintId));
    }
}
