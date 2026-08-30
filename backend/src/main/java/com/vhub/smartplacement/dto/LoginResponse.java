package com.vhub.smartplacement.dto;

public class LoginResponse {

    private final String message;
    private final String token;
    private final String name;
    private final String email;
    private final String role;

    public LoginResponse (
            String message,
            String token,
            String name,
            String email,
            String role
    ) {
        this.message = message;
        this.token = token;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
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