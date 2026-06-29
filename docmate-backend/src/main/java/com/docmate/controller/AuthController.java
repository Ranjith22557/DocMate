package com.docmate.controller;

import com.docmate.dto.AuthResponse;
import com.docmate.dto.SendOtpRequest;
import com.docmate.dto.VerifyOtpRequest;
import com.docmate.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(
            @Valid @RequestBody SendOtpRequest request) {

        authService.sendOtp(request);
        return ResponseEntity.ok("OTP Sent Successfully");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(
            @RequestBody @Valid VerifyOtpRequest request) {

        return ResponseEntity.ok(
            authService.verifyOtp(request));
    }
}