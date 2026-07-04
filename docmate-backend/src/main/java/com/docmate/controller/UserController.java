package com.docmate.controller;

import com.docmate.dto.ReminderSettingsRequest;
import com.docmate.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/reminder-settings")
    public ResponseEntity<Void> updateReminderSettings(
            @RequestBody ReminderSettingsRequest request) {

        userService.updateReminderSettings(
                request.getReminderDays()
        );

        return ResponseEntity.ok().build();
    }
}
