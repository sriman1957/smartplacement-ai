package com.vhub.smartplacement.dto;

public class RegisterResponse {

    private final String message;
    private final Long id;
    private final String name;
    private final String email;
    private final String role;

    public RegisterResponse (
            String message,
            Long id,
            String name,
            String email,
            String role
    ) {
        this.message = message;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}