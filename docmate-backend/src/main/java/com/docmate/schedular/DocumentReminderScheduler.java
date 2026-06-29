package com.docmate.schedular;

import com.docmate.entity.Document;
import com.docmate.repository.DocumentRepository;
import com.docmate.service.DocumentStatusService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DocumentReminderScheduler {

    private final DocumentRepository documentRepository;
    private final DocumentStatusService documentStatusService;
    private final JavaMailSender mailSender;


    @Scheduled(cron = "0 0 */1 * * *")
    public void sendReminders() {

        System.out.println("Running Document Reminder Scheduler...");

        List<Document> documents =
                documentRepository.findAllWithUser();

        for (Document document : documents) {

            String status =
                    documentStatusService.getStatus(
                            document.getExpiryDate(),
                            document.getRenewalRequired()
                    );

            if ("EXPIRING_SOON".equals(status) && !Boolean.TRUE.equals(document.getReminderSent())) {

                sendEmail(document);

                document.setReminderSent(true);

                documentRepository.save(document);
            }
        }
    }

    private void sendEmail(Document document) {

        if (document.getUser() == null) {
            return;
        }

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(
                document.getUser().getEmail()
        );

        message.setSubject(
                "DocMate - Document Expiry Reminder"
        );

        message.setText(
                "Hello,\n\n" +
                        "Your document '" +
                        document.getDocumentName() +
                        "' will expire on " +
                        document.getExpiryDate() +
                        ".\n\n" +
                        "Please renew it before expiry.\n\n" +
                        "Regards,\nDocMate Team"
        );

        mailSender.send(message);

        System.out.println(
                "Reminder sent for document : "
                        + document.getDocumentName()
        );
    }
}