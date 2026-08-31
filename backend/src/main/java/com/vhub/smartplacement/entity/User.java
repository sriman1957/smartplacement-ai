package com.vhub.smartplacement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String username;

    /*
     * Kept for compatibility with the existing profile module.
     * This stores firstName + lastName.
     */
    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected User() {
    }

    @PrePersist
    private void setCreatedAt() {
        createdAt = LocalDateTime.now();
    }

    public User(
            String firstName,
            String lastName,
            String username,
            String email,
            String password,
            String role
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.name = buildFullName(firstName, lastName);
        this.email = email;
        this.password = password;
        this.role = role;
    }

    private String buildFullName(String firstName, String lastName) {
        return firstName.trim() + " " + lastName.trim();
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

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}