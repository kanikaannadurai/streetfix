package com.streetfix.controller;

import com.streetfix.dto.AnalyticsDashboardResponse;
import com.streetfix.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN') or hasRole('WARD_SUPERVISOR') or hasRole('ZONAL_OFFICER') or hasRole('MUNICIPAL_COMMISSIONER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<AnalyticsDashboardResponse> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.getDashboardStats());
    }
}
