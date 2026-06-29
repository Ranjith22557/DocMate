package com.docmate.controller;

import com.docmate.service.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class TestDocMateController {

    private final EmailService emailService;

    @GetMapping("/api/test")
    public String test() {

        return "JWT Working";
    }

    @GetMapping("/test-email")
    public String testEmail() {

        emailService.sendReminder(
                "ranjithannadurai@qualiantech.com",
                "Passport",
                "2027-01-10"
        );

        return "Mail Sent";
    }
}