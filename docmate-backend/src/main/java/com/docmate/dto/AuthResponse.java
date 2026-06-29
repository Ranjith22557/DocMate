package com.docmate.dto;

public record AuthResponse(
        String token,
        String email
) {
}