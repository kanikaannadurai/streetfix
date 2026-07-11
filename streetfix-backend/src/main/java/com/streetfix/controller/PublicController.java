package com.streetfix.controller;

import com.streetfix.dto.PublicDashboardResponse;
import com.streetfix.service.PublicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final PublicService publicService;

    @GetMapping("/dashboard")
    public ResponseEntity<PublicDashboardResponse> getPublicDashboard() {
        return ResponseEntity.ok(publicService.getPublicDashboardStats());
    }
}
