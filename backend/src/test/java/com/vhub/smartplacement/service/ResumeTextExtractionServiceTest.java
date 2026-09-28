package com.vhub.smartplacement.service;

import com.vhub.smartplacement.entity.Resume;
import com.vhub.smartplacement.exception.ResumeValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ResumeTextExtractionServiceTest {

    @TempDir
    Path temporaryDirectory;

    private ResumeTextExtractionService extractionService;

    @BeforeEach
    void setUp() {
        extractionService =
                new ResumeTextExtractionService(temporaryDirectory);
    }

    @Test
    void shouldExtractTextFromPdf() throws IOException {

        Path pdfPath =
                temporaryDirectory.resolve("resume.pdf");

        Files.write(
                pdfPath,
                createPdf("John Doe Java Spring Boot MySQL")
        );

        Resume resume = createResume("resume.pdf");

        String extractedText =
                extractionService.extractText(resume);

        assertTrue(
                extractedText.contains("John Doe"),
                "Extracted text should contain the candidate name."
        );

        assertTrue(
                extractedText.contains("Java"),
                "Extracted text should contain Java."
        );

        assertTrue(
                extractedText.contains("Spring Boot"),
                "Extracted text should contain Spring Boot."
        );

        assertTrue(
                extractedText.contains("MySQL"),
                "Extracted text should contain MySQL."
        );
    }

    @Test
    void shouldExtractTextFromDocx() throws IOException {

        Path docxPath =
                temporaryDirectory.resolve("resume.docx");

        createDocx(
                docxPath,
                "Jane Doe Python Django PostgreSQL"
        );

        Resume resume = createResume("resume.docx");

        String extractedText =
                extractionService.extractText(resume);

        assertTrue(
                extractedText.contains("Jane Doe"),
                "Extracted text should contain the candidate name."
        );

        assertTrue(
                extractedText.contains("Python"),
                "Extracted text should contain Python."
        );

        assertTrue(
                extractedText.contains("Django"),
                "Extracted text should contain Django."
        );

        assertTrue(
                extractedText.contains("PostgreSQL"),
                "Extracted text should contain PostgreSQL."
        );
    }

    @Test
    void shouldNormalizeExtractedWhitespace() throws IOException {

        Path pdfPath =
                temporaryDirectory.resolve("whitespace-resume.pdf");

        Files.write(
                pdfPath,
                createPdf("Java    Spring\nBoot     MySQL")
        );

        Resume resume =
                createResume("whitespace-resume.pdf");

        String extractedText =
                extractionService.extractText(resume);

        assertEquals(
                "Java Spring Boot MySQL",
                extractedText
        );
    }

    @Test
    void shouldRejectResumeWithNoExtractableText()
            throws IOException {

        Path emptyFile =
                temporaryDirectory.resolve("empty.pdf");

        Files.write(
                emptyFile,
                createPdf("")
        );

        Resume resume =
                createResume("empty.pdf");

        ResumeValidationException exception =
                assertThrows(
                        ResumeValidationException.class,
                        () -> extractionService.extractText(resume)
                );

        assertEquals(
                "No readable text could be extracted from the resume.",
                exception.getMessage()
        );
    }

    @Test
    void shouldRejectMissingResumeFile() {

        Resume resume =
                createResume("missing.pdf");

        ResumeValidationException exception =
                assertThrows(
                        ResumeValidationException.class,
                        () -> extractionService.extractText(resume)
                );

        assertEquals(
                "Resume file could not be accessed.",
                exception.getMessage()
        );
    }

    @Test
    void shouldRejectResumeWithMissingStoredFileName() {

        Resume resume =
                new Resume(
                        null,
                        "resume.pdf",
                        "",
                        "application/pdf",
                        100L,
                        temporaryDirectory
                                .resolve("resume.pdf")
                                .toString()
                );

        ResumeValidationException exception =
                assertThrows(
                        ResumeValidationException.class,
                        () -> extractionService.extractText(resume)
                );

        assertEquals(
                "Resume stored filename is not available.",
                exception.getMessage()
        );
    }

    private Resume createResume(String storedFileName) {

        Path filePath =
                temporaryDirectory.resolve(storedFileName);

        return new Resume(
                null,
                storedFileName,
                storedFileName,
                detectFileType(storedFileName),
                100L,
                filePath.toString()
        );
    }

    private String detectFileType(String fileName) {

        if (fileName.toLowerCase().endsWith(".docx")) {
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }

        return "application/pdf";
    }

    private byte[] createPdf(String text) {

        String escapedText = text
                .replace("\\", "\\\\")
                .replace("(", "\\(")
                .replace(")", "\\)");

        String contentStream =
                "BT\n" +
                        "/F1 12 Tf\n" +
                        "72 720 Td\n" +
                        "(" + escapedText + ") Tj\n" +
                        "ET\n";

        byte[] contentBytes =
                contentStream.getBytes(StandardCharsets.US_ASCII);

        String pdf =
                "%PDF-1.4\n" +
                        "1 0 obj\n" +
                        "<< /Type /Catalog /Pages 2 0 R >>\n" +
                        "endobj\n" +
                        "2 0 obj\n" +
                        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n" +
                        "endobj\n" +
                        "3 0 obj\n" +
                        "<< /Type /Page /Parent 2 0 R " +
                        "/MediaBox [0 0 612 792] " +
                        "/Resources << /Font << /F1 4 0 R >> >> " +
                        "/Contents 5 0 R >>\n" +
                        "endobj\n" +
                        "4 0 obj\n" +
                        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\n" +
                        "endobj\n" +
                        "5 0 obj\n" +
                        "<< /Length " + contentBytes.length + " >>\n" +
                        "stream\n" +
                        contentStream +
                        "endstream\n" +
                        "endobj\n";

        byte[] pdfBytes =
                pdf.getBytes(StandardCharsets.US_ASCII);

        int object1Offset = pdf.indexOf("1 0 obj");
        int object2Offset = pdf.indexOf("2 0 obj");
        int object3Offset = pdf.indexOf("3 0 obj");
        int object4Offset = pdf.indexOf("4 0 obj");
        int object5Offset = pdf.indexOf("5 0 obj");

        String xref =
                "xref\n" +
                        "0 6\n" +
                        "0000000000 65535 f \n" +
                        formatOffset(object1Offset) + " 00000 n \n" +
                        formatOffset(object2Offset) + " 00000 n \n" +
                        formatOffset(object3Offset) + " 00000 n \n" +
                        formatOffset(object4Offset) + " 00000 n \n" +
                        formatOffset(object5Offset) + " 00000 n \n";

        int xrefOffset =
                pdfBytes.length;

        String trailer =
                "trailer\n" +
                        "<< /Size 6 /Root 1 0 R >>\n" +
                        "startxref\n" +
                        xrefOffset +
                        "\n%%EOF\n";

        byte[] xrefBytes =
                xref.getBytes(StandardCharsets.US_ASCII);

        byte[] trailerBytes =
                trailer.getBytes(StandardCharsets.US_ASCII);

        byte[] result =
                new byte[
                        pdfBytes.length +
                                xrefBytes.length +
                                trailerBytes.length
                        ];

        System.arraycopy(
                pdfBytes,
                0,
                result,
                0,
                pdfBytes.length
        );

        System.arraycopy(
                xrefBytes,
                0,
                result,
                pdfBytes.length,
                xrefBytes.length
        );

        System.arraycopy(
                trailerBytes,
                0,
                result,
                pdfBytes.length + xrefBytes.length,
                trailerBytes.length
        );

        return result;
    }

    private String formatOffset(int offset) {

        return String.format("%010d", offset);
    }

    private void createDocx(
            Path outputPath,
            String text
    ) throws IOException {

        try (ZipOutputStream zipOutputStream =
                     new ZipOutputStream(
                             Files.newOutputStream(outputPath)
                     )) {

            addZipEntry(
                    zipOutputStream,
                    "[Content_Types].xml",
                    """
                    <?xml version="1.0" encoding="UTF-8"?>
                    <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
                        <Default Extension="rels"
                            ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
                        <Default Extension="xml"
                            ContentType="application/xml"/>
                        <Override PartName="/word/document.xml"
                            ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
                    </Types>
                    """
            );

            addZipEntry(
                    zipOutputStream,
                    "_rels/.rels",
                    """
                    <?xml version="1.0" encoding="UTF-8"?>
                    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
                        <Relationship
                            Id="rId1"
                            Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"
                            Target="word/document.xml"/>
                    </Relationships>
                    """
            );

            String escapedText = escapeXml(text);

            addZipEntry(
                    zipOutputStream,
                    "word/document.xml",
                    """
                    <?xml version="1.0" encoding="UTF-8"?>
                    <w:document
                        xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
                        <w:body>
                            <w:p>
                                <w:r>
                                    <w:t>%s</w:t>
                                </w:r>
                            </w:p>
                        </w:body>
                    </w:document>
                    """.formatted(escapedText)
            );
        }
    }

    private void addZipEntry(
            ZipOutputStream zipOutputStream,
            String entryName,
            String content
    ) throws IOException {

        ZipEntry entry =
                new ZipEntry(entryName);

        zipOutputStream.putNextEntry(entry);

        zipOutputStream.write(
                content.getBytes(StandardCharsets.UTF_8)
        );

        zipOutputStream.closeEntry();
    }

    private String escapeXml(String text) {

        return text
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }
}