package com.customercomplaint;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final SecurityContextRepository securityContextRepository;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            SecurityContextRepository securityContextRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.securityContextRepository = securityContextRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody(required = false) LoginRequest loginRequest,
            HttpServletRequest request,
            HttpServletResponse response) {

        if (loginRequest == null || loginRequest.getEmail() == null || loginRequest.getPassword() == null
                || loginRequest.getEmail().trim().isEmpty() || loginRequest.getPassword().trim().isEmpty()) {
            Map<String, Object> errorResponse = new LinkedHashMap<>();
            errorResponse.put("authenticated", false);
            errorResponse.put("error", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }

        try {
            Authentication authReq = new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail().trim(),
                    loginRequest.getPassword()
            );
            Authentication authResult = authenticationManager.authenticate(authReq);

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authResult);
            SecurityContextHolder.setContext(context);
            securityContextRepository.saveContext(context, request, response);

            return userRepository.findByEmail(loginRequest.getEmail().trim())
                    .<ResponseEntity<?>>map(user -> {
                        Map<String, Object> body = new LinkedHashMap<>();
                        body.put("authenticated", true);
                        body.put("email", user.getEmail());
                        body.put("role", user.getRole());
                        body.put("fullName", user.getFullName());
                        return ResponseEntity.ok(body);
                    })
                    .orElseGet(() -> {
                        Map<String, Object> errorResponse = new LinkedHashMap<>();
                        errorResponse.put("authenticated", false);
                        errorResponse.put("error", "Invalid email or password");
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
                    });

        } catch (AuthenticationException e) {
            Map<String, Object> errorResponse = new LinkedHashMap<>();
            errorResponse.put("authenticated", false);
            errorResponse.put("error", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        securityContextRepository.saveContext(SecurityContextHolder.createEmptyContext(), request, response);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("authenticated", false);
        body.put("message", "Logged out successfully");
        return ResponseEntity.ok(body);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            Map<String, Object> errorResponse = new LinkedHashMap<>();
            errorResponse.put("authenticated", false);
            errorResponse.put("error", "Not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .<ResponseEntity<?>>map(user -> {
                    Map<String, Object> body = new LinkedHashMap<>();
                    body.put("authenticated", true);
                    body.put("email", user.getEmail());
                    body.put("role", user.getRole());
                    body.put("fullName", user.getFullName());
                    return ResponseEntity.ok(body);
                })
                .orElseGet(() -> {
                    Map<String, Object> errorResponse = new LinkedHashMap<>();
                    errorResponse.put("authenticated", false);
                    errorResponse.put("error", "Not authenticated");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
                });
    }
}
