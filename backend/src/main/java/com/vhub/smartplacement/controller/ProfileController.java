package com.vhub.smartplacement.controller;

import com.vhub.smartplacement.dto.ProfileResponse;
import com.vhub.smartplacement.service.ProfileService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(
            ProfileService profileService
    ) {
        this.profileService = profileService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile (
            Authentication authentication
    ) {
        String email = authentication.getName();

        ProfileResponse response = profileService.getProfile(email);

        return ResponseEntity.ok(response);
    }
}