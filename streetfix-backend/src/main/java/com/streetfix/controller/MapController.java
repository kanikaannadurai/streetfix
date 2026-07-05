package com.streetfix.controller;

import com.streetfix.dto.HeatmapPointResponse;
import com.streetfix.service.HeatmapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/maps")
@RequiredArgsConstructor
public class MapController {

    private final HeatmapService heatmapService;

    @GetMapping("/heatmap")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER') or hasRole('WARD_SUPERVISOR') or hasRole('MUNICIPAL_COMMISSIONER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<HeatmapPointResponse>> getHeatmapData() {
        return ResponseEntity.ok(heatmapService.generateHeatmapData());
    }
}
