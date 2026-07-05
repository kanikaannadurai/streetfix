package com.streetfix.controller;

import com.streetfix.service.PerformanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/performance")
public class PerformanceController {

    private final PerformanceService performanceService;

    public PerformanceController(PerformanceService performanceService) {
        this.performanceService = performanceService;
    }

    @GetMapping("/officer")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or hasRole('MUNICIPAL_COMMISSIONER') or hasRole('WARD_SUPERVISOR') or hasRole('ZONAL_OFFICER')")
    public ResponseEntity<List<Map<String, Object>>> getOfficerPerformances() {
        return ResponseEntity.ok(performanceService.getOfficerPerformances());
    }

    @GetMapping("/ward")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or hasRole('MUNICIPAL_COMMISSIONER') or hasRole('ZONAL_OFFICER')")
    public ResponseEntity<Map<String, Object>> getWardPerformance() {
        return ResponseEntity.ok(performanceService.getWardPerformance());
    }

    @GetMapping("/department")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or hasRole('MUNICIPAL_COMMISSIONER')")
    public ResponseEntity<Map<String, Object>> getDepartmentPerformance() {
        return ResponseEntity.ok(performanceService.getDepartmentPerformance());
    }

    @GetMapping("/leaderboards")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or hasRole('MUNICIPAL_COMMISSIONER') or hasRole('WARD_SUPERVISOR') or hasRole('ZONAL_OFFICER')")
    public ResponseEntity<Map<String, Object>> getLeaderboards() {
        return ResponseEntity.ok(performanceService.getLeaderboards());
    }
}
