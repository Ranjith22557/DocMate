package com.docmate.controller;

import com.docmate.dto.*;
import com.docmate.entity.Document;
import com.docmate.entity.User;
import com.docmate.repository.DocumentRepository;
import com.docmate.repository.UserRepository;
import com.docmate.service.DocumentAnalyzerService;
import com.docmate.service.DocumentService;
import com.docmate.service.OcrService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.docmate.service.FileStorageService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;
    private final FileStorageService fileStorageService;
    private final DocumentAnalyzerService documentAnalyzerService;
    private final OcrService ocrService;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<DocumentResponse> createDocument(
            @RequestBody DocumentRequest request) {

        return ResponseEntity.ok(
                documentService.createDocument(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<DocumentResponse>> getMyDocuments() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Email---->"+email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                documentService.getMyDocuments());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDocument(
            @PathVariable UUID id) {

        documentService.deleteDocument(id);

        return ResponseEntity.ok("Document Deleted Successfully");
    }

    @PostMapping("/upload")
    public ResponseEntity<UploadResponse> uploadDocument(
            @RequestParam("file") MultipartFile file)
            throws IOException {

        String filePath = fileStorageService.storeFile(file);

        String ocrText = ocrService.extractText(new File(filePath));
        DocumentAnalysisResult result = documentAnalyzerService.analyze(ocrText);

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Document document = new Document();

        document.setFileName(file.getOriginalFilename());
        document.setFilePath(filePath);
        document.setOcrText(ocrText);
        document.setDocumentType(result.getDocumentType());
        document.setConfidence(result.getConfidence());
        document.setExpiryDate(result.getExpiryDate());
        document.setRenewalRequired(result.getRenewalRequired());
        document.setDocumentName(file.getOriginalFilename());
        document.setCreatedAt(LocalDateTime.now());
        document.setUser(user);

        documentRepository.save(document);

        return ResponseEntity.ok(
                new UploadResponse(
                        file.getOriginalFilename(),
                        filePath
                )
        );
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard() {

        return ResponseEntity.ok(
                documentService.getDashboard()
        );
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<AlertResponse>> getAlerts() {

        return ResponseEntity.ok(
                documentService.getDashboardAlerts()
        );
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable UUID id) throws IOException {

        Document document = documentRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Document not found"));

        Path path = Paths.get(document.getFilePath());

        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\""+ document.getFileName()+ "\"")
                .body(resource);
    }

    @GetMapping("/{id}/view")
    public ResponseEntity<Resource> viewDocument(
            @PathVariable UUID id) throws IOException {

        Document document = documentRepository.findById(id).orElseThrow(() ->
                        new RuntimeException("Document not found"));

        Path path = Paths.get(document.getFilePath());
        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,"inline; filename=\"" +
                        document.getFileName() +"\"")
                .body(resource);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<RecentDocumentResponse>> recentDocuments() {

        return ResponseEntity.ok(
                documentService.getRecentDocuments()
        );

    }
}