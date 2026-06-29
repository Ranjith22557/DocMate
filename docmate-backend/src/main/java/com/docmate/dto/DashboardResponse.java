package com.docmate.dto;

public record DashboardResponse(

        long totalDocuments,
        long activeDocuments,
        long expiringSoonDocuments,
        long expiredDocuments,
        long noRenewalRequiredDocuments

) {
}