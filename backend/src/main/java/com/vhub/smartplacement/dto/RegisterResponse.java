package com.vhub.smartplacement.dto;

public class RegisterResponse {

    private final String message;
    private final Long id;
    private final String firstName;
    private final String lastName;
    private final String username;
    private final String email;
    private final String role;

    public RegisterResponse(
            String message,
            Long id,
            String firstName,
            String lastName,
            String username,
            String email,
            String role
    ) {
        this.message = message;
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}