package com.vhub.smartplacement.service;

import com.vhub.smartplacement.dto.LoginRequest;
import com.vhub.smartplacement.dto.LoginResponse;
import com.vhub.smartplacement.dto.RegisterRequest;
import com.vhub.smartplacement.dto.RegisterResponse;
import com.vhub.smartplacement.entity.User;
import com.vhub.smartplacement.exception.EmailAlreadyExistsException;
import com.vhub.smartplacement.repository.UserRepository;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private static final String STUDENT_ROLE = "STUDENT";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService (
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email is already registered");
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

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow( () ->
                    new BadCredentialsException ("Invalid email or password")
                );

        boolean passwordMatches = passwordEncoder.matches (
                request.getPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new BadCredentialsException ("Invalid email or password");
        }

        String token = jwtService.generateToken(
                user.getEmail()
        );

        return new LoginResponse (
                "Login Successful",
                token,
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}