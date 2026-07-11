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
import com.streetfix.service.NotificationService;
import com.streetfix.enums.Role;
import com.streetfix.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private final NotificationService notificationService;

    public ComplaintServiceImpl(ComplaintRepository complaintRepository, 
                                UserRepository userRepository,
                                AiClassificationService aiClassificationService,
                                EmergencyComplaintService emergencyComplaintService,
                                ComplaintSupportService supportService,
                                NotificationService notificationService) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
        this.aiClassificationService = aiClassificationService;
        this.emergencyComplaintService = emergencyComplaintService;
        this.supportService = supportService;
        this.notificationService = notificationService;
    }

    @Override
    public ComplaintResponse createComplaint(ComplaintRequest request, String email) {
        User citizen = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Citizen not found"));

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
                .address(request.getAddress())
                .imageUrl(request.getImageUrl())
                .assetCode(request.getAssetCode())
                .citizen(citizen)
                .build();

        Complaint saved = complaintRepository.save(complaint);
        
        if (saved.getPriority() == com.streetfix.enums.Priority.CRITICAL) {
            emergencyComplaintService.triggerEmergencyProtocol(saved);
        }

        String title = "New Complaint Reported";
        String message = String.format("A new complaint has been submitted by a citizen and requires your attention.\nComplaint ID: %d\nTitle: %s\nCitizen: %s\nCategory: %s\nPriority: %s\nAddress: %s", 
                saved.getId(), saved.getTitle(), citizen.getName(), saved.getCategory(), saved.getPriority(), saved.getAddress());

        notificationService.createNotificationForRole(Role.ROLE_OFFICER, saved.getId(), title, message);
        notificationService.createNotificationForRole(Role.ROLE_WARD_SUPERVISOR, saved.getId(), title, message);
        notificationService.createNotificationForRole(Role.ROLE_ASSISTANT_COMMISSIONER, saved.getId(), title, message);
        notificationService.createNotificationForRole(Role.ROLE_ZONAL_OFFICER, saved.getId(), title, message);
        notificationService.createNotificationForRole(Role.ROLE_MUNICIPAL_COMMISSIONER, saved.getId(), title, message);

        return mapToResponse(saved);
    }

    @Override
    public ComplaintResponse updateComplaint(Long id, ComplaintRequest request) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setCategory(request.getCategory());
        complaint.setPriority(request.getPriority());
        if (request.getLatitude() != null) complaint.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) complaint.setLongitude(request.getLongitude());
        if (request.getAddress() != null) complaint.setAddress(request.getAddress());
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
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
    }

    @Override
    public List<ComplaintResponse> getAllComplaints() {
        return complaintRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public Page<ComplaintResponse> getAllComplaintsPaged(Pageable pageable) {
        return complaintRepository.findAll(pageable).map(this::mapToResponse);
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
        User citizen = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Citizen not found"));
        return complaintRepository.findByCitizenId(citizen.getId()).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public Page<ComplaintResponse> getComplaintsByCitizenPaged(String email, Pageable pageable) {
        User citizen = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Citizen not found"));
        return complaintRepository.findByCitizenId(citizen.getId(), pageable).map(this::mapToResponse);
    }

    @Override
    public List<ComplaintResponse> getComplaintsByAssetCode(String assetCode) {
        return complaintRepository.findByAssetCode(assetCode).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public ComplaintResponse updateStatus(Long id, ComplaintStatus status) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        complaint.setStatus(status);
        Complaint saved = complaintRepository.save(complaint);

        if (status == ComplaintStatus.ACCEPTED) {
            notificationService.createNotificationForRole(Role.ROLE_OFFICER, saved.getId(), "Worker Accepted Assignment", "The assigned worker has accepted the complaint.");
        } else if (status == ComplaintStatus.COMPLETED) {
            notificationService.createNotificationForRole(Role.ROLE_OFFICER, saved.getId(), "Work Completed", "The worker has completed the assigned complaint. Please verify it.");
        } else if (status == ComplaintStatus.CLOSED) {
            notificationService.createNotificationForUser(saved.getCitizen().getId(), Role.ROLE_CITIZEN.name(), saved.getId(), "Complaint Closed", "Your complaint has been officially closed. Thank you for using StreetFix.");
        }

        return mapToResponse(saved);
    }

    @Override
    public ComplaintResponse verifyComplaint(Long id, com.streetfix.dto.VerificationRequestDto request, String email) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        User citizen = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Citizen not found"));

        if (!complaint.getCitizen().getId().equals(citizen.getId())) {
            throw new com.streetfix.exception.UnauthorizedException("Only the citizen who created this complaint can verify it.");
        }

        complaint.setCitizenApproved(request.getApproved());
        complaint.setCitizenRemarks(request.getRemarks());

        if (Boolean.TRUE.equals(request.getApproved())) {
            complaint.setStatus(ComplaintStatus.CLOSED);
            notificationService.createNotificationForUser(citizen.getId(), Role.ROLE_CITIZEN.name(), complaint.getId(), "Complaint Resolved", "Your complaint has been successfully resolved.");
        } else {
            complaint.setStatus(ComplaintStatus.IN_PROGRESS);
        }

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
                .address(complaint.getAddress())
                .imageUrl(complaint.getImageUrl())
                .assetCode(complaint.getAssetCode())
                .citizenId(complaint.getCitizen().getId())
                .citizenName(complaint.getCitizen().getName())
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .supportCount(supportService.getSupportCount(complaint.getId()))
                .beforeImageUrl(complaint.getBeforeImageUrl())
                .afterImageUrl(complaint.getAfterImageUrl())
                .citizenRemarks(complaint.getCitizenRemarks())
                .citizenApproved(complaint.getCitizenApproved())
                .build();
    }
}
