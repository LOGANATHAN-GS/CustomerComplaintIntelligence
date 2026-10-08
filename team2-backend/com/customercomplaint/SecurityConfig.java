package com.customercomplaint;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(CustomUserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, DaoAuthenticationProvider authenticationProvider) throws Exception {
        http
            .csrf(csrf -> csrf.ignoringRequestMatchers("/api/**", "/complaints/**"))
            .authorizeHttpRequests(auth -> auth
                // Customer-safe tracking endpoint (public)
                .requestMatchers(HttpMethod.GET, "/api/customer/complaints/**", "/customer/complaints/**").permitAll()
                // Complaint submission and analysis endpoints (public)
                .requestMatchers(HttpMethod.POST, "/api/complaints/**", "/complaints/**").permitAll()
                // Authentication endpoints (public)
                .requestMatchers("/api/auth/**").permitAll()
                // Internal company complaint endpoints (restricted to ROLE_COMPANY)
                .requestMatchers(HttpMethod.GET, "/api/complaints", "/complaints", "/api/complaints/**", "/complaints/**").hasRole("COMPANY")
                // Protected company HTML pages (restricted to ROLE_COMPANY)
                .requestMatchers("/company.html", "/history.html", "/dashboard.html").hasRole("COMPANY")
                // Remaining requests permitted (index.html, complaint.html, result.html, style.css, script.js)
                .anyRequest().permitAll()
            )
            .authenticationProvider(authenticationProvider)
            .securityContext(context -> context
                .securityContextRepository(securityContextRepository())
            );

        return http.build();
    }
}
