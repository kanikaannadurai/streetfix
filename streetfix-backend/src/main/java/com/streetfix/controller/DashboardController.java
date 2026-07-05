package com.streetfix.controller;

import com.streetfix.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }

    @GetMapping("/officer")
    @PreAuthorize("hasRole('OFFICER') or hasRole('WORKER')")
    public ResponseEntity<Map<String, Object>> getOfficerDashboard(Principal principal) {
        return ResponseEntity.ok(dashboardService.getOfficerDashboard(principal.getName()));
    }

    @GetMapping("/citizen")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<Map<String, Object>> getCitizenDashboard(Principal principal) {
        return ResponseEntity.ok(dashboardService.getCitizenDashboard(principal.getName()));
    }

    @GetMapping("/ward-supervisor")
    @PreAuthorize("hasRole('WARD_SUPERVISOR')")
    public ResponseEntity<Map<String, Object>> getWardSupervisorDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }

    @GetMapping("/commissioner")
    @PreAuthorize("hasRole('ASSISTANT_COMMISSIONER') or hasRole('MUNICIPAL_COMMISSIONER') or hasRole('ZONAL_OFFICER')")
    public ResponseEntity<Map<String, Object>> getCommissionerDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }
}
