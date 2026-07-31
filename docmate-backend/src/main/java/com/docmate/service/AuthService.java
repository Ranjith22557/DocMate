package com.docmate.service;

import com.docmate.dto.AuthResponse;
import com.docmate.dto.SendOtpRequest;
import com.docmate.dto.VerifyOtpRequest;
import com.docmate.entity.OtpVerification;
import com.docmate.entity.User;
import com.docmate.repository.OtpVerificationRepository;
import com.docmate.repository.UserRepository;
import com.docmate.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final OtpService otpService;
    private final EmailService emailService;
    private final OtpVerificationRepository otpRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public void sendOtp(SendOtpRequest request) {

        String otp = otpService.generateOtp();

        OtpVerification entity = OtpVerification.builder()
                .email(request.email())
                .otp(otp)
                .expiryTime(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .build();

        otpRepository.save(entity);

        emailService.sendOtpEmail(request.email(), otp);
    }

    public AuthResponse verifyOtp(VerifyOtpRequest request) {

        OtpVerification otpEntity = otpRepository
                .findTopByEmailOrderByExpiryTimeDesc(request.email())
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        Optional<User> existingUser =
                userRepository.findByEmail(request.email());

        if (existingUser.isEmpty()) {
            User user = User.builder()
                    .email(request.email())
                    .createdAt(LocalDateTime.now())
                    .reminderDays(7)
                    .build();
            userRepository.save(user);
        }

        if (otpEntity.isVerified()) {
            throw new RuntimeException("OTP already used");
        }
        if (!otpEntity.getOtp().equals(request.otp())) {
            throw new RuntimeException("Invalid OTP");
        }
        if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Expired OTP");
        }

        otpEntity.setVerified(true);
        otpRepository.save(otpEntity);

        String token = jwtService.generateToken(request.email());
        return new AuthResponse(
                token,
                request.email()
        );
        
    }
}