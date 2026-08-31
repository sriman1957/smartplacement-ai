package com.vhub.smartplacement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String college;

    @Column(nullable = false)
    private String degree;

    @Column(nullable = false)
    private String branch;

    @Column(nullable = false)
    private Integer graduationYear;

    @Column(nullable = false, length = 2000)
    private String skills;

    private String githubUrl;

    private String linkedinUrl;

    private String portfolioUrl;

    private String profilePhotoUrl;

    @Column(length = 2000)
    private String careerObjective;

    protected StudentProfile() {
    }

    public StudentProfile(
            User user,
            String phone,
            String college,
            String degree,
            String branch,
            Integer graduationYear,
            String skills,
            String githubUrl,
            String linkedinUrl,
            String portfolioUrl,
            String profilePhotoUrl,
            String careerObjective
    ) {
        this.user = user;
        this.phone = phone;
        this.college = college;
        this.degree = degree;
        this.branch = branch;
        this.graduationYear = graduationYear;
        this.skills = skills;
        this.githubUrl = githubUrl;
        this.linkedinUrl = linkedinUrl;
        this.portfolioUrl = portfolioUrl;
        this.profilePhotoUrl = profilePhotoUrl;
        this.careerObjective = careerObjective;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
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

    public String getProfilePhotoUrl() {
        return profilePhotoUrl;
    }

    public String getCareerObjective() {
        return careerObjective;
    }

    public void updateProfile(
            String phone,
            String college,
            String degree,
            String branch,
            Integer graduationYear,
            String skills,
            String githubUrl,
            String linkedinUrl,
            String portfolioUrl,
            String profilePhotoUrl,
            String careerObjective
    ) {
        this.phone = phone;
        this.college = college;
        this.degree = degree;
        this.branch = branch;
        this.graduationYear = graduationYear;
        this.skills = skills;
        this.githubUrl = githubUrl;
        this.linkedinUrl = linkedinUrl;
        this.portfolioUrl = portfolioUrl;
        this.profilePhotoUrl = profilePhotoUrl;
        this.careerObjective = careerObjective;
    }
}