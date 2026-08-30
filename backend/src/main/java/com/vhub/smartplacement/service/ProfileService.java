package com.vhub.smartplacement.service;

import com.vhub.smartplacement.dto.ProfileResponse;
import com.vhub.smartplacement.entity.User;
import com.vhub.smartplacement.repository.UserRepository;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileService(
            UserRepository userRepository
    ) {
        this.userRepository = userRepository;
    }

    public ProfileResponse getProfile(
            String email
    ) {
        User user = userRepository.findByEmail(email)
                .orElseThrow( () ->
                        new UsernameNotFoundException(
                                "User not found"
                        )
                );

        return new ProfileResponse(
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}