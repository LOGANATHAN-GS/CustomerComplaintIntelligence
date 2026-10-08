package com.customercomplaint;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        String adminEmail = "admin@company.com";

        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            // Development/demo seed password: immediately hashed with BCrypt before saving
            String rawDevPassword = "Admin@12345";
            String hashedPassword = passwordEncoder.encode(rawDevPassword);

            User adminUser = new User(
                    adminEmail,
                    hashedPassword,
                    "ROLE_COMPANY",
                    "System Administrator"
            );
            adminUser.ensureIdAndTimestamp();

            userRepository.save(adminUser);
        }

        String customerEmail = "customer@example.com";

        if (userRepository.findByEmail(customerEmail).isEmpty()) {
            // Development/demo customer password: immediately hashed with BCrypt before saving
            String rawDevCustomerPassword = "Customer@12345";
            String hashedCustomerPassword = passwordEncoder.encode(rawDevCustomerPassword);

            User customerUser = new User(
                    customerEmail,
                    hashedCustomerPassword,
                    "ROLE_CUSTOMER",
                    "Demo Customer"
            );
            customerUser.ensureIdAndTimestamp();

            userRepository.save(customerUser);
        }
    }
}
