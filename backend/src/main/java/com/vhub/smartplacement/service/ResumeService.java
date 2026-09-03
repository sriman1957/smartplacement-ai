package com.vhub.smartplacement.service;

import com.vhub.smartplacement.dto.ResumeResponse;
import com.vhub.smartplacement.entity.Resume;
import com.vhub.smartplacement.entity.User;
import com.vhub.smartplacement.exception.ResumeNotFoundException;
import com.vhub.smartplacement.repository.ResumeRepository;
import com.vhub.smartplacement.repository.UserRepository;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final ResumeFileValidationService resumeFileValidationService;
    private final Path resumeUploadDirectory;

    public ResumeService(
            ResumeRepository resumeRepository,
            UserRepository userRepository,
            ResumeFileValidationService resumeFileValidationService,
            @Qualifier("resumeUploadDirectory") Path resumeUploadDirectory
    ) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
        this.resumeFileValidationService = resumeFileValidationService;
        this.resumeUploadDirectory = resumeUploadDirectory;
    }

    @Transactional
    public ResumeResponse uploadResume(
            String email,
            MultipartFile file
    ) throws IOException {

        User user = findUserByEmail(email);

        resumeFileValidationService.validate(file);

        String originalFileName = getSafeOriginalFileName(file);
        String extension = extractExtension(originalFileName);
        String storedFileName = UUID.randomUUID() + "." + extension;

        Path targetPath = resumeUploadDirectory.resolve(storedFileName);

        storeFile(file, targetPath);

        Resume newResume = new Resume(
                user,
                originalFileName,
                storedFileName,
                detectFileType(file),
                file.getSize(),
                targetPath.toString()
        );

        Resume savedResume = resumeRepository.save(newResume);

        replaceExistingResumes(user, savedResume);

        return toResumeResponse(savedResume);
    }

    @Transactional(readOnly = true)
    public List<ResumeResponse> getResumes(String email) {

        User user = findUserByEmail(email);

        return resumeRepository.findByUser(user)
                .stream()
                .map(this::toResumeResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ResumeResponse getResume(
            String email,
            Long resumeId
    ) {

        User user = findUserByEmail(email);

        Resume resume = resumeRepository
                .findByIdAndUser(resumeId, user)
                .orElseThrow(() ->
                        new ResumeNotFoundException(
                                "Resume not found"
                        )
                );

        return toResumeResponse(resume);
    }

    @Transactional
    public void deleteResume(
            String email,
            Long resumeId
    ) throws IOException {

        User user = findUserByEmail(email);

        Resume resume = resumeRepository
                .findByIdAndUser(resumeId, user)
                .orElseThrow(() ->
                        new ResumeNotFoundException(
                                "Resume not found"
                        )
                );

        deletePhysicalFile(resume.getFilePath());

        resumeRepository.delete(resume);
    }

    public Path getResumeFilePath(
            String email,
            Long resumeId
    ) {

        User user = findUserByEmail(email);

        Resume resume = resumeRepository
                .findByIdAndUser(resumeId, user)
                .orElseThrow(() ->
                        new ResumeNotFoundException(
                                "Resume not found"
                        )
                );

        return Path.of(resume.getFilePath());
    }

    private User findUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Authenticated user not found"
                        )
                );
    }

    private String getSafeOriginalFileName(
            MultipartFile file
    ) {

        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null || originalFileName.isBlank()) {
            throw new IllegalArgumentException(
                    "Resume filename is required"
            );
        }

        String normalizedFileName = Path.of(originalFileName)
                .getFileName()
                .toString();

        if (normalizedFileName.isBlank()) {
            throw new IllegalArgumentException(
                    "Resume filename is invalid"
            );
        }

        return normalizedFileName;
    }

    private String extractExtension(String fileName) {

        int lastDotIndex = fileName.lastIndexOf('.');

        if (lastDotIndex < 0 ||
                lastDotIndex == fileName.length() - 1) {

            throw new IllegalArgumentException(
                    "Resume file extension is required"
            );
        }

        return fileName
                .substring(lastDotIndex + 1)
                .toLowerCase();
    }

    private String detectFileType(
            MultipartFile file
    ) throws IOException {

        return new org.apache.tika.Tika().detect(
                file.getInputStream(),
                file.getOriginalFilename()
        );
    }

    private void storeFile(
            MultipartFile file,
            Path targetPath
    ) throws IOException {

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetPath);
        }
    }

    private void replaceExistingResumes(
            User user,
            Resume newResume
    ) throws IOException {

        List<Resume> existingResumes =
                resumeRepository.findByUser(user);

        for (Resume existingResume : existingResumes) {

            if (!existingResume.getId().equals(newResume.getId())) {

                deletePhysicalFile(
                        existingResume.getFilePath()
                );

                resumeRepository.delete(existingResume);
            }
        }
    }

    private void deletePhysicalFile(
            String filePath
    ) throws IOException {

        if (filePath == null || filePath.isBlank()) {
            return;
        }

        Path path = Path.of(filePath);

        if (Files.exists(path)) {
            Files.delete(path);
        }
    }

    private ResumeResponse toResumeResponse(
            Resume resume
    ) {

        return new ResumeResponse(
                resume.getId(),
                resume.getOriginalFileName(),
                resume.getFileType(),
                resume.getFileSize(),
                resume.getUploadedAt()
        );
    }
}