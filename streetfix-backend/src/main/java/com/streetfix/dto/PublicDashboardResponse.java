package com.streetfix.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicDashboardResponse {
    private long totalComplaints;
    private long resolvedComplaints;
    private long pendingComplaints;
    private Map<String, Long> categoryStats;
    private Map<String, Long> wardStats;
}
