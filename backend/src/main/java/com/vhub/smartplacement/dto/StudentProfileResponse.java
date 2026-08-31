package com.vhub.smartplacement.dto;

public class StudentProfileResponse {

    private Long profileId;
    private String name;
    private String username;
    private String email;
    private String role;
    private String phone;
    private String college;
    private String degree;
    private String branch;
    private Integer graduationYear;
    private String skills;
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    private String careerObjective;

    public StudentProfileResponse(
            Long profileId,
            String name,
            String username,
            String email,
            String role,
            String phone,
            String college,
            String degree,
            String branch,
            Integer graduationYear,
            String skills,
            String githubUrl,
            String linkedinUrl,
            String portfolioUrl,
            String careerObjective
    ) {
        this.profileId = profileId;
        this.name = name;
        this.username = username;
        this.email = email;
        this.role = role;
        this.phone = phone;
        this.college = college;
        this.degree = degree;
        this.branch = branch;
        this.graduationYear = graduationYear;
        this.skills = skills;
        this.githubUrl = githubUrl;
        this.linkedinUrl = linkedinUrl;
        this.portfolioUrl = portfolioUrl;
        this.careerObjective = careerObjective;
    }

    public Long getProfileId() {
        return profileId;
    }

    public String getName() {
        return name;
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

    public String getPhone() {
        return phone;
    }

    public String getCollege() {
        return college;
    }

    public String getDegree() {
        return degree;
    }

    public String getBranch() {
        return branch;
    }

    public Integer getGraduationYear() {
        return graduationYear;
    }

    public String getSkills() {
        return skills;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public String getPortfolioUrl() {
        return portfolioUrl;
    }

    public String getCareerObjective() {
        return careerObjective;
    }
}