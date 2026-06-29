package com.docmate.dto;

import java.time.LocalDate;

public record AlertResponse(

        String documentName,
        LocalDate expiryDate,
        long daysRemaining,
        String status

) {
}