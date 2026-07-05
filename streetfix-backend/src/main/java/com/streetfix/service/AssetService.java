package com.streetfix.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.streetfix.entity.Asset;
import com.streetfix.repository.AssetRepository;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AssetService {

    private final AssetRepository assetRepository;

    public AssetService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    public Asset createAsset(String type, Double latitude, Double longitude, String locationName) {
        String assetCode = type + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        Asset asset = Asset.builder()
                .assetCode(assetCode)
                .type(type)
                .latitude(latitude)
                .longitude(longitude)
                .locationName(locationName)
                .status("ACTIVE")
                .build();
                
        return assetRepository.save(asset);
    }

    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    public Optional<Asset> getAssetByCode(String assetCode) {
        return assetRepository.findByAssetCode(assetCode);
    }

    public Asset getAssetById(Long id) {
        return assetRepository.findById(id).orElseThrow(() -> new RuntimeException("Asset not found"));
    }

    public Asset updateAsset(Long id, Map<String, Object> request) {
        Asset asset = assetRepository.findById(id).orElseThrow(() -> new RuntimeException("Asset not found"));
        if (request.containsKey("type")) asset.setType((String) request.get("type"));
        if (request.containsKey("latitude")) asset.setLatitude(((Number) request.get("latitude")).doubleValue());
        if (request.containsKey("longitude")) asset.setLongitude(((Number) request.get("longitude")).doubleValue());
        if (request.containsKey("locationName")) asset.setLocationName((String) request.get("locationName"));
        if (request.containsKey("status")) asset.setStatus((String) request.get("status"));
        return assetRepository.save(asset);
    }

    public void deleteAsset(Long id) {
        assetRepository.deleteById(id);
    }

    public byte[] generateQrCodeForAsset(String assetCode) throws Exception {
        QRCodeWriter barcodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = barcodeWriter.encode(assetCode, BarcodeFormat.QR_CODE, 200, 200);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        return pngOutputStream.toByteArray();
    }
}
