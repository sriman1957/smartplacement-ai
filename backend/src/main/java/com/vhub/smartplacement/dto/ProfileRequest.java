package com.vhub.smartplacement.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ProfileRequest {

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Phone number must contain exactly 10 digits"
    )
    private String phone;

    @NotBlank(message = "College is required")
    @Size(
            max = 200,
            message = "College name must not exceed 200 characters"
    )
    private String college;

    @NotBlank(message = "Degree is required")
    @Size(
            max = 100,
            message = "Degree must not exceed 100 characters"
    )
    private String degree;

    @NotBlank(message = "Branch is required")
    @Size(
            max = 100,
            message = "Branch must not exceed 100 characters"
    )
    private String branch;

    @Min(
            value = 2000,
            message = "Graduation year is not valid"
    )
    @Max(
            value = 2100,
            message = "Graduation year is not valid"
    )
    private Integer graduationYear;

    @NotBlank(message = "Skills are required")
    @Size(
            max = 2000,
            message = "Skills must not exceed 2000 characters"
    )
    private String skills;

    @Pattern(
            regexp = "^$|https://github\\.com/[^\\s]+$",
            message = "GitHub URL must be a valid HTTPS GitHub URL"
    )
    private String githubUrl;

    @Pattern(
            regexp = "^$|https://(www\\.)?linkedin\\.com/in/[^\\s]+$",
            message = "LinkedIn URL must be a valid HTTPS LinkedIn profile URL"
    )
    private String linkedinUrl;

    @Pattern(
            regexp = "^$|https://[^\\s]+$",
            message = "Portfolio URL must be a valid HTTPS URL"
    )
    private String portfolioUrl;

    @Pattern(
            regexp = "^$|https://[^\\s]+$",
            message = "Profile photo URL must be a valid HTTPS URL"
    )
    private String profilePhotoUrl;

    @Size(
            max = 2000,
            message = "Career objective must not exceed 2000 characters"
    )
    private String careerObjective;

    public ProfileRequest() {
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public Integer getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(Integer graduationYear) {
        this.graduationYear = graduationYear;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public String getPortfolioUrl() {
        return portfolioUrl;
    }

    public void setPortfolioUrl(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
    }

    public String getProfilePhotoUrl() {
        return profilePhotoUrl;
    }

    public void setProfilePhotoUrl(String profilePhotoUrl) {
        this.profilePhotoUrl = profilePhotoUrl;
    }

    public String getCareerObjective() {
        return careerObjective;
    }

    public void setCareerObjective(String careerObjective) {
        this.careerObjective = careerObjective;
    }
}