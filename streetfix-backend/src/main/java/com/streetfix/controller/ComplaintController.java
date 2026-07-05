package com.streetfix.controller;

import com.streetfix.dto.ComplaintRequest;
import com.streetfix.dto.ComplaintResponse;
import com.streetfix.enums.ComplaintStatus;
import com.streetfix.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;
    private final com.streetfix.service.DuplicateDetectionService duplicateDetectionService;

    @GetMapping("/check-duplicates")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<List<com.streetfix.dto.DuplicateComplaintResponse>> checkDuplicates(
            @RequestParam(required = false) String category,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam Double latitude,
            @RequestParam Double longitude) {
        return ResponseEntity.ok(duplicateDetectionService.findPotentialDuplicates(category, title, description, latitude, longitude));
    }

    @PostMapping
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<ComplaintResponse> createComplaint(@Valid @RequestBody ComplaintRequest request, Principal principal) {
        return ResponseEntity.ok(complaintService.createComplaint(request, principal.getName()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER') or hasRole('WARD_SUPERVISOR') " +
                  "or hasRole('ASSISTANT_COMMISSIONER') or hasRole('ZONAL_OFFICER') " +
                  "or hasRole('MUNICIPAL_COMMISSIONER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }
    
    @GetMapping("/my")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints(Principal principal) {
        return ResponseEntity.ok(complaintService.getComplaintsByCitizen(principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintResponse> getComplaintById(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<ComplaintResponse> updateComplaint(@PathVariable Long id, @Valid @RequestBody ComplaintRequest request) {
        return ResponseEntity.ok(complaintService.updateComplaint(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ComplaintResponse>> getComplaintsByStatus(@PathVariable ComplaintStatus status) {
        return ResponseEntity.ok(complaintService.getComplaintsByStatus(status));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ComplaintResponse>> getComplaintsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(complaintService.getComplaintsByCategory(category));
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER') or hasRole('WORKER') " +
                  "or hasRole('WARD_SUPERVISOR') or hasRole('ASSISTANT_COMMISSIONER') " +
                  "or hasRole('MUNICIPAL_COMMISSIONER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<ComplaintResponse> updateComplaintStatus(@PathVariable Long id, @RequestParam ComplaintStatus status) {
        return ResponseEntity.ok(complaintService.updateStatus(id, status));
    }
}
