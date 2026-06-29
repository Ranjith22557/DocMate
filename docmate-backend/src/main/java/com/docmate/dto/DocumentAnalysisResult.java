package com.docmate.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentAnalysisResult {

    private String documentType;
    private String documentNumber;
    private LocalDate expiryDate;
    private Boolean renewalRequired;
    private Integer confidence;
}