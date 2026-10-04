package com.vhub.smartplacement.exception;

import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger =
            LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /*
     * Request validation errors.
     * Returns all field errors without assuming that a field error exists.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException exception
    ) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error -> fieldErrors.putIfAbsent(
                        error.getField(),
                        error.getDefaultMessage() != null
                                ? error.getDefaultMessage()
                                : "Invalid value"
                ));

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Validation failed");
        body.put("errors", fieldErrors);

        return ResponseEntity
                .badRequest()
                .body(body);
    }

    /*
     * Malformed JSON or an unreadable request body.
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleUnreadableRequest(
            HttpMessageNotReadableException exception
    ) {
        return error(
                HttpStatus.BAD_REQUEST,
                "Request body is missing or malformed"
        );
    }

    /*
     * Duplicate email.
     */
    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleEmailAlreadyExists(
            EmailAlreadyExistsException exception
    ) {
        return error(
                HttpStatus.CONFLICT,
                exception.getMessage()
        );
    }

    /*
     * Duplicate username.
     */
    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleUsernameAlreadyExists(
            UsernameAlreadyExistsException exception
    ) {
        return error(
                HttpStatus.CONFLICT,
                exception.getMessage()
        );
    }

    /*
     * Invalid login credentials.
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(
            BadCredentialsException exception
    ) {
        return error(
                HttpStatus.UNAUTHORIZED,
                "Invalid email or password"
        );
    }

    /*
     * Student profile already exists.
     */
    @ExceptionHandler(StudentProfileAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>>
    handleStudentProfileAlreadyExists(
            StudentProfileAlreadyExistsException exception
    ) {
        return error(
                HttpStatus.CONFLICT,
                exception.getMessage()
        );
    }

    /*
     * Student profile not found.
     */
    @ExceptionHandler(StudentProfileNotFoundException.class)
    public ResponseEntity<Map<String, Object>>
    handleStudentProfileNotFound(
            StudentProfileNotFoundException exception
    ) {
        return error(
                HttpStatus.NOT_FOUND,
                exception.getMessage()
        );
    }

    /*
     * Resume not found.
     */
    @ExceptionHandler(ResumeNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResumeNotFound(
            ResumeNotFoundException exception
    ) {
        return error(
                HttpStatus.NOT_FOUND,
                exception.getMessage()
        );
    }

    /*
     * Invalid resume file or resume-related input.
     */
    @ExceptionHandler(ResumeValidationException.class)
    public ResponseEntity<Map<String, Object>> handleResumeValidation(
            ResumeValidationException exception
    ) {
        return error(
                HttpStatus.BAD_REQUEST,
                exception.getMessage()
        );
    }

    /*
     * Upload exceeds the configured multipart limit.
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxUploadSizeExceeded(
            MaxUploadSizeExceededException exception
    ) {
        return error(
                HttpStatus.PAYLOAD_TOO_LARGE,
                "Uploaded file exceeds the permitted size"
        );
    }

    /*
     * Database constraint violation.
     * Do not expose SQL, table names, or database error details.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(
            DataIntegrityViolationException exception
    ) {
        logger.warn(
                "Database integrity constraint violation",
                exception
        );

        return error(
                HttpStatus.CONFLICT,
                "The request conflicts with existing data"
        );
    }

    /*
     * Unsupported request content type.
     */
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> handleUnsupportedMediaType(
            HttpMediaTypeNotSupportedException exception
    ) {
        return error(
                HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                "Unsupported content type"
        );
    }

    /*
     * Unsupported HTTP method.
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> handleMethodNotSupported(
            HttpRequestMethodNotSupportedException exception
    ) {
        return error(
                HttpStatus.METHOD_NOT_ALLOWED,
                "HTTP method not allowed for this endpoint"
        );
    }

    /*
     * AI analysis failure.
     * Provider details should not be exposed to clients.
     */
    @ExceptionHandler(AIAnalysisException.class)
    public ResponseEntity<Map<String, Object>> handleAIAnalysis(
            AIAnalysisException exception
    ) {
        logger.warn(
                "Resume AI analysis failed",
                exception
        );

        return error(
                HttpStatus.SERVICE_UNAVAILABLE,
                "Resume analysis is temporarily unavailable"
        );
    }

    /*
     * Catch-all handler.
     * Never return exception messages or stack traces to the client.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(
            Exception exception
    ) {
        logger.error(
                "Unhandled exception while processing request",
                exception
        );

        return error(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred"
        );
    }

    /*
     * Creates a consistent API error response.
     */
    private ResponseEntity<Map<String, Object>> error(
            HttpStatus status,
            String message
    ) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", message);

        return ResponseEntity
                .status(status)
                .body(body);
    }
}
