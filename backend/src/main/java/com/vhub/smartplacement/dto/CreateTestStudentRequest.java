package com.vhub.smartplacement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateTestStudentRequest {
    // this annotation for NAME makes sure USER INPUT is valid and follows imposed rules
    @NotBlank(message = "Name is Required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;
    // this annotation for EMAIL makes sure USER INPUT is valid and follows imposed rules
    @NotBlank(message = "Email is Required")
    @Email(message = "Email must be a Valid one")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;
    // getting NAME using getters
    public String getName() {
        return name;
    }
    // getting EMAIL using getters
    public String getEmail() {
        return email;
    }

}