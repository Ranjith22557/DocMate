package com.docmate.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String documentName;

    @Column(nullable = false)
    private String documentType;

    private LocalDate issueDate;
    private LocalDate expiryDate;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    private  String documentNumber;
    private String fileName;
    private String filePath;
    private Boolean ocrProcessed;
    private Boolean renewalRequired;
    private Integer confidence;

    @Column(nullable = false)
    private Boolean reminderSent = false;

    @Column(columnDefinition = "TEXT")
    private String ocrText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}