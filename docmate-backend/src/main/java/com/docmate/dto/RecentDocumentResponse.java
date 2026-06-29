package com.docmate.dto;

import java.time.LocalDate;
import java.util.UUID;

public record RecentDocumentResponse(

        UUID id,
        String documentName,
        String documentType,
        LocalDate expiryDate,
        Integer confidence

) {
}