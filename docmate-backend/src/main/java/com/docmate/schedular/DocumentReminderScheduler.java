package com.docmate.schedular;

import com.docmate.entity.Document;
import com.docmate.repository.DocumentRepository;
import com.docmate.service.DocumentStatusService;
import com.docmate.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DocumentReminderScheduler {

    private final DocumentRepository documentRepository;
    private final DocumentStatusService documentStatusService;
    private final EmailService emailService;

    // Runs every day at 9:00 AM
    @Scheduled(cron = "0 0 9 * * *")
    public void sendReminders() {

        log.info("Running Document Reminder Scheduler...");

        List<Document> documents = documentRepository.findByReminderSentFalseAndUserIsNotNull();

        for (Document document : documents) {

            // Skip invalid documents
            if (document.getExpiryDate() == null) {
                continue;
            }
            String formattedDate = document.getExpiryDate()
                    .format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy"));

            long daysRemaining = ChronoUnit.DAYS.between(
                    LocalDate.now(),
                    document.getExpiryDate()
            );
            /*if (daysRemaining <= document.getUser().getReminderDays()) {
                emailService.sendReminder(
                        document.getUser().getEmail(),
                        document.getDocumentName(),
                        formattedDate
                );
                document.setReminderSent(true);
                documentRepository.save(document);
            }*/
        }
        log.info("Document Reminder Scheduler completed.");
    }
}