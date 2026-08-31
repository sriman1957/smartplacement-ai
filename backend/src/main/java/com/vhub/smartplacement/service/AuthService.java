package com.vhub.smartplacement.service;

import com.vhub.smartplacement.dto.LoginRequest;
import com.vhub.smartplacement.dto.LoginResponse;
import com.vhub.smartplacement.dto.RegisterRequest;
import com.vhub.smartplacement.dto.RegisterResponse;
import com.vhub.smartplacement.entity.User;
import com.vhub.smartplacement.exception.EmailAlreadyExistsException;
import com.vhub.smartplacement.exception.UsernameAlreadyExistsException;
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

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public RegisterResponse register(RegisterRequest request) {
        String firstName = request.getFirstName().trim();
        String lastName = request.getLastName().trim();
        String username = request.getUsername().trim();
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException(
                    "Email is already registered"
            );
        }

        if (userRepository.existsByUsername(username)) {
            throw new UsernameAlreadyExistsException(
                    "Username is already taken"
            );
        }

        String encodedPassword =
                passwordEncoder.encode(request.getPassword());

        User user = new User(
                firstName,
                lastName,
                username,
                email,
                encodedPassword,
                STUDENT_ROLE
        );

        User savedUser =
                userRepository.save(user);

        return new RegisterResponse(
                "Registration Successful",
                savedUser.getId(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    public boolean isUsernameAvailable(String username) {
        String normalizedUsername =
                username.trim();

        if (normalizedUsername.length() < 3
                || normalizedUsername.length() > 30) {
            return false;
        }

        if (!normalizedUsername.matches(
                "^[a-zA-Z0-9_]+$"
        )) {
            return false;
        }

        return !userRepository.existsByUsername(
                normalizedUsername
        );
    }

    public LoginResponse login(LoginRequest request) {
        String email =
                request.getEmail().trim().toLowerCase();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new BadCredentialsException(
                                        "Invalid email or password"
                                )
                        );

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {
            throw new BadCredentialsException(
                    "Invalid email or password"
            );
        }

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        return new LoginResponse(
                "Login Successful",
                token,
                user.getFirstName(),
                user.getLastName(),
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }
}