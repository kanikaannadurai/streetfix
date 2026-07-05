package com.streetfix.service;

import com.lowagie.text.DocumentException;
import com.streetfix.entity.Complaint;
import com.streetfix.enums.ComplaintStatus;
import com.streetfix.enums.Priority;
import com.streetfix.repository.ComplaintRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.Predicate;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReportService {

    private final ComplaintRepository complaintRepository;
    private final ExportService exportService;

    public ReportService(ComplaintRepository complaintRepository, ExportService exportService) {
        this.complaintRepository = complaintRepository;
        this.exportService = exportService;
    }

    public List<Complaint> searchComplaints(String startDate, String endDate, String category, String status, String priority) {
        return complaintRepository.findAll((Specification<Complaint>) (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(startDate) && StringUtils.hasText(endDate)) {
                LocalDateTime start = LocalDate.parse(startDate, DateTimeFormatter.ISO_DATE).atStartOfDay();
                LocalDateTime end = LocalDate.parse(endDate, DateTimeFormatter.ISO_DATE).atTime(23, 59, 59);
                predicates.add(cb.between(root.get("createdAt"), start, end));
            }

            if (StringUtils.hasText(category)) {
                predicates.add(cb.equal(root.get("category"), category));
            }

            if (StringUtils.hasText(status)) {
                predicates.add(cb.equal(root.get("status"), ComplaintStatus.valueOf(status.toUpperCase())));
            }

            if (StringUtils.hasText(priority)) {
                predicates.add(cb.equal(root.get("priority"), Priority.valueOf(priority.toUpperCase())));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        });
    }

    public byte[] exportComplaintsPdf(String startDate, String endDate, String category, String status, String priority) throws DocumentException {
        List<Complaint> complaints = searchComplaints(startDate, endDate, category, status, priority);
        return exportService.generatePdfReport(complaints, "Complaint Report");
    }

    public byte[] exportComplaintsCsv(String startDate, String endDate, String category, String status, String priority) throws IOException {
        List<Complaint> complaints = searchComplaints(startDate, endDate, category, status, priority);
        return exportService.generateCsvReport(complaints);
    }

    public byte[] exportComplaintsExcel(String startDate, String endDate, String category, String status, String priority) throws IOException {
        List<Complaint> complaints = searchComplaints(startDate, endDate, category, status, priority);
        return exportService.generateExcelReport(complaints);
    }
}
