package com.docmate.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String email, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("DocMate - OTP Verification");

        message.setText(
                "Your DocMate OTP is: "
                        + otp
                        + "\n\nThis OTP will expire in 5 minutes."
        );

        mailSender.send(message);
    }

    //Expiry email service
    public void sendExpiryReminder(String email,String documentName,LocalDate expiryDate) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("Document Expiry Reminder");
        message.setText("Your document "+ documentName+ " expires on "
                        + expiryDate);

        mailSender.send(message);
    }

    public void sendReminder(String toEmail,String documentName,String expiryDate) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("DocMate - Document Expiry Reminder");
        message.setText("Your document '"+ documentName + "' expires on " + expiryDate
                        + ". Please renew it.");

        mailSender.send(message);
    }
}