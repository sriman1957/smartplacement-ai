package com.vhub.smartplacement.controller;

import com.vhub.smartplacement.dto.ResumeResponse;
import com.vhub.smartplacement.service.ResumeService;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {
    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ResumeResponse> uploadResume(
            Authentication authentication,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        String email = authentication.getName();

        ResumeResponse response =  resumeService.uploadResume( email,  file );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ResumeResponse>> getResumes( Authentication authentication ) {
        String email = authentication.getName();

        List<ResumeResponse> response = resumeService.getResumes(email);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeResponse> getResume( Authentication authentication,  @PathVariable Long id ) {
        String email = authentication.getName();

        ResumeResponse response = resumeService.getResume( email, id );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<Resource> downloadResume(
            Authentication authentication,
            @PathVariable Long id
    ) throws IOException {
        String email = authentication.getName();

        Path filePath = resumeService.getResumeFilePath( email, id );

        if (!Files.exists(filePath)) { return ResponseEntity.notFound().build(); }

        Resource resource = new FileSystemResource(filePath);

        String contentType = Files.probeContentType(filePath);

        MediaType mediaType =
                contentType != null
                        ? MediaType.parseMediaType(contentType)
                        : MediaType.APPLICATION_OCTET_STREAM;

        return ResponseEntity.ok().contentType(mediaType).body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume( Authentication authentication, @PathVariable Long id ) throws IOException {

        String email = authentication.getName();

        resumeService.deleteResume( email, id );

        return ResponseEntity.noContent().build();
    }
}
