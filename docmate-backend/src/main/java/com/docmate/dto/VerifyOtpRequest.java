package com.docmate.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record VerifyOtpRequest(

        @Email
        String email,

        @NotBlank
        String otp

) {}