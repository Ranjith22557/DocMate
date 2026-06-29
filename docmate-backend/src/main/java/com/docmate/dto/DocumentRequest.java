package com.docmate.dto;

import java.time.LocalDate;

public record DocumentRequest(

        String documentName,

        String documentType,

        LocalDate issueDate,

        LocalDate expiryDate

) {
}