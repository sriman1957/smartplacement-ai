package com.vhub.smartplacement.service;

import com.vhub.smartplacement.exception.ResumeValidationException;

import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Locale;
import java.util.Set;

@Service
public class ResumeFileValidationService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "pdf",
            "docx"
    );

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    private final Tika tika;

    @Value("${app.file.max-size}")
    private long maxFileSize;

    public ResumeFileValidationService() {
        this.tika = new Tika();
    }

    public void validate(MultipartFile file) throws IOException {
        validateFilePresent(file);
        validateFileSize(file);
        validateExtension(file);
        validateContentType(file);
    }

    private void validateFilePresent(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResumeValidationException(
                    "Resume file is required"
            );
        }
    }

    private void validateFileSize(MultipartFile file) {
        if (file.getSize() > maxFileSize) {
            throw new ResumeValidationException(
                    "Resume file size must not exceed 10 MB"
            );
        }
    }

    private void validateExtension(MultipartFile file) {
        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null || originalFileName.isBlank()) {
            throw new ResumeValidationException(
                    "Resume filename is required"
            );
        }

        String extension = extractExtension(originalFileName);

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ResumeValidationException(
                    "Only PDF and DOCX files are allowed"
            );
        }
    }

    private void validateContentType(
            MultipartFile file
    ) throws IOException {

        String originalFileName = file.getOriginalFilename();

        String detectedContentType = tika.detect(
                file.getInputStream(),
                originalFileName
        );

        if (!ALLOWED_CONTENT_TYPES.contains(detectedContentType)) {
            throw new ResumeValidationException(
                    "Invalid resume file content"
            );
        }
    }

    private String extractExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');

        if (lastDotIndex < 0 ||
                lastDotIndex == fileName.length() - 1) {
            return "";
        }

        return fileName
                .substring(lastDotIndex + 1)
                .toLowerCase(Locale.ROOT);
    }
}