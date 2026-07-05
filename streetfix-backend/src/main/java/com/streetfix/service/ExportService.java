package com.streetfix.service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.opencsv.CSVWriter;
import com.streetfix.entity.Complaint;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.List;

@Service
public class ExportService {

    public byte[] generatePdfReport(List<Complaint> complaints, String title) throws DocumentException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, out);
        document.open();

        Font fontTitle = new Font(Font.HELVETICA, 18, Font.BOLD);
        Paragraph p = new Paragraph(title, fontTitle);
        p.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(p);
        
        document.add(new Paragraph(" ")); // blank line

        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100f);
        table.setWidths(new float[] {1.0f, 2.5f, 1.5f, 1.5f, 1.5f, 1.5f});
        
        table.addCell("ID");
        table.addCell("Title");
        table.addCell("Category");
        table.addCell("Status");
        table.addCell("Priority");
        table.addCell("Date");

        for (Complaint c : complaints) {
            table.addCell(String.valueOf(c.getId()));
            table.addCell(c.getTitle());
            table.addCell(c.getCategory() != null ? c.getCategory() : "-");
            table.addCell(c.getStatus() != null ? c.getStatus().name() : "-");
            table.addCell(c.getPriority() != null ? c.getPriority().name() : "-");
            table.addCell(c.getCreatedAt() != null ? c.getCreatedAt().toLocalDate().toString() : "-");
        }

        document.add(table);
        document.close();
        return out.toByteArray();
    }

    public byte[] generateCsvReport(List<Complaint> complaints) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (CSVWriter writer = new CSVWriter(new OutputStreamWriter(out))) {
            writer.writeNext(new String[]{"ID", "Title", "Description", "Category", "Priority", "Status", "Asset Code", "Date"});
            for (Complaint c : complaints) {
                writer.writeNext(new String[]{
                    String.valueOf(c.getId()),
                    c.getTitle(),
                    c.getDescription(),
                    c.getCategory() != null ? c.getCategory() : "",
                    c.getPriority() != null ? c.getPriority().name() : "",
                    c.getStatus() != null ? c.getStatus().name() : "",
                    c.getAssetCode() != null ? c.getAssetCode() : "",
                    c.getCreatedAt() != null ? c.getCreatedAt().toString() : ""
                });
            }
        }
        return out.toByteArray();
    }

    public byte[] generateExcelReport(List<Complaint> complaints) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Complaints");
            Row headerRow = sheet.createRow(0);
            String[] columns = {"ID", "Title", "Category", "Priority", "Status", "Asset Code", "Date"};
            
            for (int i = 0; i < columns.length; i++) {
                headerRow.createCell(i).setCellValue(columns[i]);
            }
            
            int rowIdx = 1;
            for (Complaint c : complaints) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(c.getId());
                row.createCell(1).setCellValue(c.getTitle());
                row.createCell(2).setCellValue(c.getCategory() != null ? c.getCategory() : "");
                row.createCell(3).setCellValue(c.getPriority() != null ? c.getPriority().name() : "");
                row.createCell(4).setCellValue(c.getStatus() != null ? c.getStatus().name() : "");
                row.createCell(5).setCellValue(c.getAssetCode() != null ? c.getAssetCode() : "");
                row.createCell(6).setCellValue(c.getCreatedAt() != null ? c.getCreatedAt().toString() : "");
            }
            
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(out);
            return out.toByteArray();
        }
    }
}
