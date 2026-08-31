package com.vhub.smartplacement.dto;

public class LoginResponse {

    private final String message;
    private final String token;
    private final String firstName;
    private final String lastName;
    private final String username;
    private final String email;
    private final String role;

    public LoginResponse(
            String message,
            String token,
            String firstName,
            String lastName,
            String username,
            String email,
            String role
    ) {
        this.message = message;
        this.token = token;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
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