package com.docmate.service;

import com.docmate.dto.*;
import com.docmate.entity.Document;
import com.docmate.entity.User;
import com.docmate.repository.DocumentRepository;
import com.docmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final DocumentStatusService documentStatusService;

    public DocumentResponse createDocument(DocumentRequest request) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        System.out.println("Logged In User : " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Document document = Document.builder()
                .documentName(request.documentName())
                .documentType(request.documentType())
                .issueDate(request.issueDate())
                .expiryDate(request.expiryDate())
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        Document savedDocument = documentRepository.save(document);

        return new DocumentResponse(
                savedDocument.getId(),
                savedDocument.getDocumentName(),
                savedDocument.getDocumentType(),
                savedDocument.getIssueDate(),
                savedDocument.getExpiryDate(),
                savedDocument.getDocumentNumber(),
                savedDocument.getConfidence(),
                documentStatusService.getStatus(document.getExpiryDate(),document.getRenewalRequired())
        );
    }

    public List<DocumentResponse> getMyDocuments() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return documentRepository.findByUserEmail(email)
                .stream()
                .map(document -> new DocumentResponse(
                        document.getId(),
                        document.getDocumentName(),
                        document.getDocumentType(),
                        document.getIssueDate(),
                        document.getExpiryDate(),
                        document.getDocumentNumber(),
                        document.getConfidence(),
                        documentStatusService.getStatus(document.getExpiryDate(),document.getRenewalRequired())
                ))
                .toList();
    }

    public void deleteDocument(UUID documentId) {

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() ->
                        new RuntimeException("Document not found"));

        documentRepository.delete(document);
    }

    public DashboardResponse getDashboard() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        List<Document> documents =
                documentRepository.findByUserEmail(email);

        long total = documents.size();

        long active = documents.stream()
                .filter(d -> "ACTIVE".equals(
                        documentStatusService.getStatus(
                                d.getExpiryDate(),
                                d.getRenewalRequired())))
                .count();

        long expiringSoon = documents.stream()
                .filter(d -> "EXPIRING_SOON".equals(
                        documentStatusService.getStatus(
                                d.getExpiryDate(),
                                d.getRenewalRequired())))
                .count();

        long expired = documents.stream()
                .filter(d -> "EXPIRED".equals(
                        documentStatusService.getStatus(
                                d.getExpiryDate(),
                                d.getRenewalRequired())))
                .count();

        long noRenewal = documents.stream()
                .filter(d -> "NO_RENEWAL_REQUIRED".equals(
                        documentStatusService.getStatus(
                                d.getExpiryDate(),
                                d.getRenewalRequired())))
                .count();

        return new DashboardResponse(
                total,
                active,
                expiringSoon,
                expired,
                noRenewal
        );
    }

    public List<AlertResponse> getDashboardAlerts() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return documentRepository
                .findByUserEmail(email)
                .stream()
                .filter(document ->
                        document.getExpiryDate() != null)
                .map(document -> {

                    String status =
                            documentStatusService.getStatus(
                                    document.getExpiryDate(),
                                    document.getRenewalRequired()
                            );

                    long daysRemaining =
                            ChronoUnit.DAYS.between(
                                    LocalDate.now(),
                                    document.getExpiryDate()
                            );

                    return new AlertResponse(
                            document.getId(),
                            document.getDocumentName(),
                            document.getDocumentType(),
                            document.getExpiryDate(),
                            status
                    );
                })
                .filter(alert ->
                        "EXPIRING_SOON".equals(alert.status())
                                || "EXPIRED".equals(alert.status()))
                .toList();
    }

    public List<RecentDocumentResponse> getRecentDocuments() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return documentRepository
                .findTop5ByUserEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(document -> new RecentDocumentResponse(
                        document.getId(),
                        document.getDocumentName(),
                        document.getDocumentType(),
                        document.getExpiryDate(),
                        document.getConfidence()
                ))
                .toList();
    }

    public List<UpcomingRenewalResponse> getUpcomingRenewals() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return documentRepository
                .findByUserEmailAndExpiryDateIsNotNullOrderByExpiryDateAsc(email)
                .stream()
                .filter(document -> {

                    String status = documentStatusService.getStatus(
                            document.getExpiryDate(),
                            document.getRenewalRequired()
                    );

                    return status.equals("EXPIRING_SOON")
                            || status.equals("EXPIRED");

                })
                .limit(5)
                .map(document -> new UpcomingRenewalResponse(

                        document.getId(),
                        document.getDocumentName(),
                        document.getDocumentType(),
                        document.getExpiryDate(),
                        documentStatusService.getStatus(
                                document.getExpiryDate(),
                                document.getRenewalRequired()
                        )

                ))
                .toList();

    }

    public List<AlertResponse> getAlerts() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return documentRepository
                .findByUserEmailAndExpiryDateIsNotNullOrderByExpiryDateAsc(email)
                .stream()
                .map(document -> {

                    String status = documentStatusService.getStatus(
                            document.getExpiryDate(),
                            document.getRenewalRequired()
                    );

                    return new AlertResponse(
                            document.getId(),
                            document.getDocumentName(),
                            document.getDocumentType(),
                            document.getExpiryDate(),
                            status
                    );

                })
                .filter(alert ->
                        alert.status().equals("EXPIRING_SOON")
                                || alert.status().equals("EXPIRED"))
                .toList();

    }
}