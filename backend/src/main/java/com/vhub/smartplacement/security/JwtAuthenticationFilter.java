package com.vhub.smartplacement.security;

import com.vhub.smartplacement.service.CustomUserDetailsService;
import com.vhub.smartplacement.service.JwtService;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService userDetailsService
    ) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");

        // No bearer token: let Spring Security handle access.
        if (authorizationHeader == null
                || !authorizationHeader.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader
                .substring(BEARER_PREFIX.length())
                .trim();

        // Reject an empty bearer token.
        if (token.isEmpty()) {
            rejectUnauthorized(response);
            return;
        }

        final String email;

        // Handle invalid, expired, or malformed JWTs.
        try {
            if (!jwtService.isTokenValid(token)) {
                rejectUnauthorized(response);
                return;
            }

            email = jwtService.extractEmail(token);

            if (email == null || email.isBlank()) {
                rejectUnauthorized(response);
                return;
            }

        } catch (JwtException | IllegalArgumentException exception) {
            rejectUnauthorized(response);
            return;
        }

        // Avoid replacing an existing authenticated principal.
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            final UserDetails userDetails;

            try {
                userDetails = userDetailsService
                        .loadUserByUsername(email);
            } catch (UsernameNotFoundException exception) {
                // The account may have been deleted after token issuance.
                rejectUnauthorized(response);
                return;
            }

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            authentication.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(request)
            );

            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private void rejectUnauthorized(
            HttpServletResponse response
    ) throws IOException {

        SecurityContextHolder.clearContext();

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("WWW-Authenticate", "Bearer");

        response.getWriter().write(
                """
                {
                    "message": "Invalid or expired authentication token"
                }
                """
        );
    }
}
