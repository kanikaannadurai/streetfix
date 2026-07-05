package com.streetfix.service.impl;

import com.streetfix.dto.ComplaintRequest;
import com.streetfix.dto.ComplaintResponse;
import com.streetfix.entity.Complaint;
import com.streetfix.entity.User;
import com.streetfix.enums.ComplaintStatus;
import com.streetfix.repository.ComplaintRepository;
import com.streetfix.repository.UserRepository;
import com.streetfix.service.ComplaintService;
import com.streetfix.service.AiClassificationService;
import com.streetfix.service.EmergencyComplaintService;
import com.streetfix.service.ComplaintSupportService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final AiClassificationService aiClassificationService;
    private final EmergencyComplaintService emergencyComplaintService;
    private final ComplaintSupportService supportService;

    public ComplaintServiceImpl(ComplaintRepository complaintRepository, 
                                UserRepository userRepository,
                                AiClassificationService aiClassificationService,
                                EmergencyComplaintService emergencyComplaintService,
                                ComplaintSupportService supportService) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
        this.aiClassificationService = aiClassificationService;
        this.emergencyComplaintService = emergencyComplaintService;
        this.supportService = supportService;
    }

    @Override
    public ComplaintResponse createComplaint(ComplaintRequest request, String email) {
        User citizen = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Citizen not found"));

        String category = request.getCategory();
        if (category == null || category.trim().isEmpty()) {
            category = aiClassificationService.classifyCategory(request.getTitle(), request.getDescription());
        }

        var priority = request.getPriority();
        if (priority == null) {
            priority = aiClassificationService.detectPriority(request.getTitle(), request.getDescription());
        }

        Complaint complaint = Complaint.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(category)
                .priority(priority)
                .status(ComplaintStatus.PENDING)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .imageUrl(request.getImageUrl())
                .assetCode(request.getAssetCode())
                .citizen(citizen)
                .build();

        Complaint saved = complaintRepository.save(complaint);
        
        if (saved.getPriority() == com.streetfix.enums.Priority.CRITICAL) {
            emergencyComplaintService.triggerEmergencyProtocol(saved);
        }

        return mapToResponse(saved);
    }

    @Override
    public ComplaintResponse updateComplaint(Long id, ComplaintRequest request) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setCategory(request.getCategory());
        complaint.setPriority(request.getPriority());
        if (request.getLatitude() != null) complaint.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) complaint.setLongitude(request.getLongitude());
        if (request.getImageUrl() != null) complaint.setImageUrl(request.getImageUrl());
        if (request.getAssetCode() != null) complaint.setAssetCode(request.getAssetCode());

        return mapToResponse(complaintRepository.save(complaint));
    }

    @Override
    public void deleteComplaint(Long id) {
        complaintRepository.deleteById(id);
    }

    @Override
    public ComplaintResponse getComplaintById(Long id) {
        return complaintRepository.findById(id).map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
    }

    @Override
    public List<ComplaintResponse> getAllComplaints() {
        return complaintRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<ComplaintResponse> getComplaintsByStatus(ComplaintStatus status) {
        return complaintRepository.findByStatus(status).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<ComplaintResponse> getComplaintsByCategory(String category) {
        return complaintRepository.findByCategory(category).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<ComplaintResponse> getComplaintsByCitizen(String email) {
        User citizen = userRepository.findByEmail(email).orElseThrow();
        return complaintRepository.findByCitizenId(citizen.getId()).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<ComplaintResponse> getComplaintsByAssetCode(String assetCode) {
        return complaintRepository.findByAssetCode(assetCode).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public ComplaintResponse updateStatus(Long id, ComplaintStatus status) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setStatus(status);
        return mapToResponse(complaintRepository.save(complaint));
    }

    private ComplaintResponse mapToResponse(Complaint complaint) {
        return ComplaintResponse.builder()
                .id(complaint.getId())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .category(complaint.getCategory())
                .priority(complaint.getPriority())
                .status(complaint.getStatus())
                .latitude(complaint.getLatitude())
                .longitude(complaint.getLongitude())
                .imageUrl(complaint.getImageUrl())
                .assetCode(complaint.getAssetCode())
                .citizenId(complaint.getCitizen().getId())
                .citizenName(complaint.getCitizen().getName())
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .supportCount(supportService.getSupportCount(complaint.getId()))
                .build();
    }
}
