package com.docmate.service;

import com.docmate.enums.DocumentStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class DocumentStatusService {

    public String getStatus(
            LocalDate expiryDate,
            Boolean renewalRequired) {

        if (Boolean.FALSE.equals(renewalRequired)) {

            return DocumentStatus
                    .NO_RENEWAL_REQUIRED
                    .name();
        }

        if (expiryDate == null) {

            return DocumentStatus
                    .NO_RENEWAL_REQUIRED
                    .name();
        }

        LocalDate today =
                LocalDate.now();

        if (expiryDate.isBefore(today)) {

            return DocumentStatus
                    .EXPIRED
                    .name();
        }

        long daysRemaining =
                ChronoUnit.DAYS.between(
                        today,
                        expiryDate
                );

        if (daysRemaining <= 30) {

            return DocumentStatus
                    .EXPIRING_SOON
                    .name();
        }

        return DocumentStatus
                .ACTIVE
                .name();
    }
}