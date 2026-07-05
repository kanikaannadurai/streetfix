package com.streetfix.service;

import com.streetfix.dto.ComplaintRequest;
import com.streetfix.dto.ComplaintResponse;
import com.streetfix.enums.ComplaintStatus;

import java.util.List;

public interface ComplaintService {
    ComplaintResponse createComplaint(ComplaintRequest request, String email);
    ComplaintResponse updateComplaint(Long id, ComplaintRequest request);
    void deleteComplaint(Long id);
    ComplaintResponse getComplaintById(Long id);
    List<ComplaintResponse> getAllComplaints();
    List<ComplaintResponse> getComplaintsByStatus(ComplaintStatus status);
    List<ComplaintResponse> getComplaintsByCategory(String category);
    List<ComplaintResponse> getComplaintsByCitizen(String email);
    List<ComplaintResponse> getComplaintsByAssetCode(String assetCode);
    ComplaintResponse updateStatus(Long id, ComplaintStatus status);
}
