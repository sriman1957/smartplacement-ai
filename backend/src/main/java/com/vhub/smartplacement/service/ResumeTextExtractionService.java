package com.vhub.smartplacement.service;

import com.vhub.smartplacement.entity.Resume;
import com.vhub.smartplacement.exception.ResumeValidationException;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class ResumeTextExtractionService {

    private final Tika tika;
    private final Path resumeUploadDirectory;

    public ResumeTextExtractionService(
            @Qualifier("resumeUploadDirectory") Path resumeUploadDirectory
    ) {
        this.tika = new Tika();
        this.resumeUploadDirectory = resumeUploadDirectory
                .toAbsolutePath()
                .normalize();
    }

    public String extractText(Resume resume) {

        if (resume == null) {
            throw new ResumeValidationException(
                    "Resume could not be found."
            );
        }

        String storedFileName = resume.getStoredFileName();

        if (storedFileName == null || storedFileName.isBlank()) {
            throw new ResumeValidationException(
                    "Resume stored filename is not available."
            );
        }

        Path resumePath = resumeUploadDirectory
                .resolve(storedFileName)
                .normalize();

        if (!resumePath.startsWith(resumeUploadDirectory)) {
            throw new ResumeValidationException(
                    "Resume file path is invalid."
            );
        }

        if (!Files.exists(resumePath) ||
                !Files.isRegularFile(resumePath)) {

            throw new ResumeValidationException(
                    "Resume file could not be accessed."
            );
        }

        try (InputStream inputStream =
                     Files.newInputStream(resumePath)) {

            String extractedText =
                    tika.parseToString(inputStream);

            String normalizedText =
                    normalizeText(extractedText);

            if (normalizedText.isBlank()) {
                throw new ResumeValidationException(
                        "No readable text could be extracted from the resume."
                );
            }

            return normalizedText;

        } catch (IOException exception) {

            throw new ResumeValidationException(
                    "The resume could not be read."
            );

        } catch (TikaException exception) {

            throw new ResumeValidationException(
                    "The resume text could not be extracted."
            );
        }
    }

    private String normalizeText(String text) {

        if (text == null) {
            return "";
        }

        return text
                .replaceAll("\\s+", " ")
                .trim();
    }
}