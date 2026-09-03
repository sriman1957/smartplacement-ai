package com.vhub.smartplacement.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FileStorageConfig {

    @Value("${app.file.upload-dir}")
    private String uploadDir;

    @Bean
    public Path resumeUploadDirectory() throws IOException {
        Path directory = Paths.get(uploadDir).toAbsolutePath().normalize();

        Files.createDirectories(directory);

        return directory;
    }
}