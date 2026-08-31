package com.vhub.smartplacement.service;

import com.vhub.smartplacement.dto.ProfileRequest;
import com.vhub.smartplacement.dto.StudentProfileResponse;
import com.vhub.smartplacement.entity.StudentProfile;
import com.vhub.smartplacement.entity.User;
import com.vhub.smartplacement.exception.StudentProfileAlreadyExistsException;
import com.vhub.smartplacement.exception.StudentProfileNotFoundException;
import com.vhub.smartplacement.repository.StudentProfileRepository;
import com.vhub.smartplacement.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentProfileService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;

    public StudentProfileService(
            StudentProfileRepository studentProfileRepository,
            UserRepository userRepository
    ) {
        this.studentProfileRepository = studentProfileRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public StudentProfileResponse getProfile(String email) {
        User user = findUserByEmail(email);

        StudentProfile profile = studentProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new StudentProfileNotFoundException(
                                "Student profile not found"
                        )
                );

        return toStudentProfileResponse(profile);
    }

    @Transactional
    public StudentProfileResponse createProfile(
            String email,
            ProfileRequest request
    ) {
        User user = findUserByEmail(email);

        if (studentProfileRepository.findByUser(user).isPresent()) {
            throw new StudentProfileAlreadyExistsException(
                    "Student profile already exists"
            );
        }

        StudentProfile profile = new StudentProfile(
                user,
                request.getPhone().trim(),
                request.getCollege().trim(),
                request.getDegree().trim(),
                request.getBranch().trim(),
                request.getGraduationYear(),
                request.getSkills().trim(),
                normalizeOptionalValue(request.getGithubUrl()),
                normalizeOptionalValue(request.getLinkedinUrl()),
                normalizeOptionalValue(request.getPortfolioUrl()),
                normalizeOptionalValue(request.getProfilePhotoUrl()),
                normalizeOptionalValue(request.getCareerObjective())
        );

        StudentProfile savedProfile =
                studentProfileRepository.save(profile);

        return toStudentProfileResponse(savedProfile);
    }

    @Transactional
    public StudentProfileResponse updateProfile(
            String email,
            ProfileRequest request
    ) {
        User user = findUserByEmail(email);

        StudentProfile profile = studentProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new StudentProfileNotFoundException(
                                "Student profile not found"
                        )
                );

        profile.updateProfile(
                request.getPhone().trim(),
                request.getCollege().trim(),
                request.getDegree().trim(),
                request.getBranch().trim(),
                request.getGraduationYear(),
                request.getSkills().trim(),
                normalizeOptionalValue(request.getGithubUrl()),
                normalizeOptionalValue(request.getLinkedinUrl()),
                normalizeOptionalValue(request.getPortfolioUrl()),
                normalizeOptionalValue(request.getProfilePhotoUrl()),
                normalizeOptionalValue(request.getCareerObjective())
        );

        StudentProfile updatedProfile =
                studentProfileRepository.save(profile);

        return toStudentProfileResponse(updatedProfile);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Authenticated user not found"
                        )
                );
    }

    private StudentProfileResponse toStudentProfileResponse(
            StudentProfile profile
    ) {
        User user = profile.getUser();

        return new StudentProfileResponse(
                profile.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                profile.getPhone(),
                profile.getCollege(),
                profile.getDegree(),
                profile.getBranch(),
                profile.getGraduationYear(),
                profile.getSkills(),
                profile.getGithubUrl(),
                profile.getLinkedinUrl(),
                profile.getPortfolioUrl(),
                profile.getCareerObjective()
        );
    }

    private String normalizeOptionalValue(String value) {
        if (value == null) {
            return null;
        }

        String trimmedValue = value.trim();

        return trimmedValue.isEmpty() ? null : trimmedValue;
    }
}