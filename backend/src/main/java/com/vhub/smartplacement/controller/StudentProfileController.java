package com.vhub.smartplacement.controller;

import com.vhub.smartplacement.dto.ProfileRequest;
import com.vhub.smartplacement.dto.StudentProfileResponse;
import com.vhub.smartplacement.service.StudentProfileService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student/profile")
public class StudentProfileController {

    private final StudentProfileService studentProfileService;

    public StudentProfileController(
            StudentProfileService studentProfileService
    ) {
        this.studentProfileService = studentProfileService;
    }

    @GetMapping
    public ResponseEntity<StudentProfileResponse> getProfile(
            Authentication authentication
    ) {
        String email = authentication.getName();

        StudentProfileResponse response =
                studentProfileService.getProfile(email);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<StudentProfileResponse> createProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileRequest request
    ) {
        String email = authentication.getName();

        StudentProfileResponse response =
                studentProfileService.createProfile(
                        email,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping
    public ResponseEntity<StudentProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileRequest request
    ) {
        String email = authentication.getName();

        StudentProfileResponse response =
                studentProfileService.updateProfile(
                        email,
                        request
                );

        return ResponseEntity.ok(response);
    }
}