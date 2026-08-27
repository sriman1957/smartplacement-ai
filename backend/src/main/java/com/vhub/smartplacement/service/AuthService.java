package com.vhub.smartplacement.service;

import com.vhub.smartplacement.dto.RegisterRequest;
import com.vhub.smartplacement.dto.RegisterResponse;
import com.vhub.smartplacement.entity.User;
import com.vhub.smartplacement.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private static final String STUDENT_ROLE = "STUDENT";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService (
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already registered");
        }

        String encodedPassword =
                passwordEncoder.encode(request.getPassword());

        User user = new User (
                request.getName(),
                request.getEmail(),
                encodedPassword,
                STUDENT_ROLE
        );

        User savedUser = userRepository.save(user);

        return new RegisterResponse (
                "Registration Successful",
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }
}