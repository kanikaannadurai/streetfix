package com.streetfix.service;

import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.opencsv.CSVWriter;
import com.streetfix.entity.Complaint;
import com.streetfix.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.util.List;

@Service
public class ReportService {

    private final ComplaintRepository complaintRepository;

    public ReportService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    public byte[] generateCsvReport() throws Exception {
        List<Complaint> complaints = complaintRepository.findAll();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        
        try (CSVWriter writer = new CSVWriter(new OutputStreamWriter(out))) {
            String[] header = {"ID", "Title", "Category", "Priority", "Status", "Citizen Name", "Created At"};
            writer.writeNext(header);
            
            for (Complaint c : complaints) {
                String[] data = {
                    c.getId().toString(),
                    c.getTitle(),
                    c.getCategory(),
                    c.getPriority() != null ? c.getPriority().name() : "N/A",
                    c.getStatus().name(),
                    c.getCitizen() != null ? c.getCitizen().getName() : "Unknown",
                    c.getCreatedAt() != null ? c.getCreatedAt().toString() : "N/A"
                };
                writer.writeNext(data);
            }
        }
        return out.toByteArray();
    }

    public byte[] generatePdfReport() throws Exception {
        List<Complaint> complaints = complaintRepository.findAll();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        
        Document document = new Document();
        PdfWriter.getInstance(document, out);
        document.open();
        
        document.add(new Paragraph("StreetFix Municipal Complaint Report"));
        document.add(new Paragraph("Total Complaints: " + complaints.size()));
        document.add(new Paragraph("--------------------------------------------------"));
        
        for (Complaint c : complaints) {
            String text = String.format("ID: %d | %s | [%s] %s - Status: %s", 
                    c.getId(), c.getPriority(), c.getCategory(), c.getTitle(), c.getStatus());
            document.add(new Paragraph(text));
        }
        
        document.close();
        return out.toByteArray();
    }
}
