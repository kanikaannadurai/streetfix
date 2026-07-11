package com.streetfix.controller;

import com.streetfix.dto.AnalyticsDashboardResponse;
import com.streetfix.entity.User;
import com.streetfix.enums.Role;
import com.streetfix.repository.UserRepository;
import com.streetfix.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN') or hasRole('WARD_SUPERVISOR') or hasRole('ASSISTANT_COMMISSIONER') or hasRole('ZONAL_OFFICER') or hasRole('MUNICIPAL_COMMISSIONER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<AnalyticsDashboardResponse> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.getDashboardStats());
    }

    @GetMapping("/category")
    @PreAuthorize("hasRole('ADMIN') or hasRole('WARD_SUPERVISOR') or hasRole('ASSISTANT_COMMISSIONER') or hasRole('ZONAL_OFFICER') or hasRole('MUNICIPAL_COMMISSIONER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> getCategoryAnalytics() {
        return ResponseEntity.ok(analyticsService.getCategoryAnalytics());
    }

    @GetMapping("/priority")
    @PreAuthorize("hasRole('ADMIN') or hasRole('WARD_SUPERVISOR') or hasRole('ASSISTANT_COMMISSIONER') or hasRole('ZONAL_OFFICER') or hasRole('MUNICIPAL_COMMISSIONER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> getPriorityAnalytics() {
        return ResponseEntity.ok(analyticsService.getPriorityAnalytics());
    }

    @GetMapping("/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('WARD_SUPERVISOR') or hasRole('ASSISTANT_COMMISSIONER') or hasRole('ZONAL_OFFICER') or hasRole('MUNICIPAL_COMMISSIONER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> getStatusAnalytics() {
        return ResponseEntity.ok(analyticsService.getStatusAnalytics());
    }

    @GetMapping("/trend")
    @PreAuthorize("hasRole('ADMIN') or hasRole('WARD_SUPERVISOR') or hasRole('ASSISTANT_COMMISSIONER') or hasRole('ZONAL_OFFICER') or hasRole('MUNICIPAL_COMMISSIONER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> getTrendAnalytics(@RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(analyticsService.getTrendAnalytics(days));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN') or hasRole('WARD_SUPERVISOR') or hasRole('ASSISTANT_COMMISSIONER') or hasRole('ZONAL_OFFICER') or hasRole('MUNICIPAL_COMMISSIONER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> getUserAnalytics() {
        return ResponseEntity.ok(analyticsService.getUserAnalytics());
    }

    @GetMapping("/sla")
    @PreAuthorize("hasRole('ADMIN') or hasRole('WARD_SUPERVISOR') or hasRole('ASSISTANT_COMMISSIONER') or hasRole('ZONAL_OFFICER') or hasRole('MUNICIPAL_COMMISSIONER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> getSlaAnalytics() {
        return ResponseEntity.ok(analyticsService.getSlaAnalytics());
    }

    // === User Management (Super Admin / Admin) ===

    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/admin/users/{id}/role")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(Role.valueOf(role));
        return ResponseEntity.ok(userRepository.save(user));
    }

    @DeleteMapping("/admin/users/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
