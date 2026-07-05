package com.streetfix.controller;

import com.streetfix.dto.ComplaintResponse;
import com.streetfix.entity.Asset;
import com.streetfix.service.AssetService;
import com.streetfix.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;
    private final ComplaintService complaintService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('WARD_SUPERVISOR') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Asset> createAsset(@RequestBody Map<String, Object> request) {
        String type = (String) request.get("type");
        Double latitude = (Double) request.get("latitude");
        Double longitude = (Double) request.get("longitude");
        String locationName = (String) request.get("locationName");
        
        return ResponseEntity.ok(assetService.createAsset(type, latitude, longitude, locationName));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('WARD_SUPERVISOR') or hasRole('OFFICER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<Asset>> getAllAssets() {
        return ResponseEntity.ok(assetService.getAllAssets());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('WARD_SUPERVISOR') or hasRole('OFFICER') or hasRole('SUPER_ADMIN') or hasRole('CITIZEN')")
    public ResponseEntity<Asset> getAssetById(@PathVariable Long id) {
        return ResponseEntity.ok(assetService.getAssetById(id));
    }

    @GetMapping("/code/{assetCode}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('WARD_SUPERVISOR') or hasRole('OFFICER') or hasRole('SUPER_ADMIN') or hasRole('CITIZEN')")
    public ResponseEntity<Asset> getAssetByCode(@PathVariable String assetCode) {
        return assetService.getAssetByCode(assetCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Asset> updateAsset(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(assetService.updateAsset(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{assetCode}/complaints")
    @PreAuthorize("hasRole('ADMIN') or hasRole('WARD_SUPERVISOR') or hasRole('OFFICER') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<ComplaintResponse>> getComplaintsForAsset(@PathVariable String assetCode) {
        return ResponseEntity.ok(complaintService.getComplaintsByAssetCode(assetCode));
    }

    @GetMapping("/{assetCode}/qr")
    @PreAuthorize("hasRole('ADMIN') or hasRole('WARD_SUPERVISOR') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<byte[]> getAssetQrCode(@PathVariable String assetCode) {
        try {
            byte[] qrImage = assetService.generateQrCodeForAsset(assetCode);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            return new ResponseEntity<>(qrImage, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
