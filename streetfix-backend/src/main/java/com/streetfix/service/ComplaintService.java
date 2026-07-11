package com.streetfix.service;

import com.streetfix.dto.ComplaintRequest;
import com.streetfix.dto.ComplaintResponse;
import com.streetfix.enums.ComplaintStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ComplaintService {
    ComplaintResponse createComplaint(ComplaintRequest request, String email);
    ComplaintResponse updateComplaint(Long id, ComplaintRequest request);
    void deleteComplaint(Long id);
    ComplaintResponse getComplaintById(Long id);
    List<ComplaintResponse> getAllComplaints();
    Page<ComplaintResponse> getAllComplaintsPaged(Pageable pageable);
    List<ComplaintResponse> getComplaintsByStatus(ComplaintStatus status);
    List<ComplaintResponse> getComplaintsByCategory(String category);
    List<ComplaintResponse> getComplaintsByCitizen(String email);
    Page<ComplaintResponse> getComplaintsByCitizenPaged(String email, Pageable pageable);
    List<ComplaintResponse> getComplaintsByAssetCode(String assetCode);
    ComplaintResponse updateStatus(Long id, ComplaintStatus status);
    ComplaintResponse verifyComplaint(Long id, com.streetfix.dto.VerificationRequestDto request, String email);
}
