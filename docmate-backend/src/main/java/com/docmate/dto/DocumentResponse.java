package com.docmate.dto;

import java.time.LocalDate;
import java.util.UUID;

public record DocumentResponse(

        UUID id,

        String documentName,
        String documentType,
        LocalDate issueDate,
        LocalDate expiryDate,
        String documentNumber,
        Integer confidence,
        String status


) {
}