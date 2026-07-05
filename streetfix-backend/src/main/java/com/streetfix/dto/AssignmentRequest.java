package com.streetfix.dto;

import jakarta.validation.constraints.NotNull;

public class AssignmentRequest {

    @NotNull
    private Long complaintId;

    private Long officerId;
    private Long workerId;

    public AssignmentRequest() {}

    public Long getComplaintId() { return complaintId; }
    public void setComplaintId(Long complaintId) { this.complaintId = complaintId; }

    public Long getOfficerId() { return officerId; }
    public void setOfficerId(Long officerId) { this.officerId = officerId; }

    public Long getWorkerId() { return workerId; }
    public void setWorkerId(Long workerId) { this.workerId = workerId; }
}
