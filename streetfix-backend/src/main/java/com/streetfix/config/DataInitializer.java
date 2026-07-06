package com.streetfix.config;

import com.streetfix.entity.User;
import com.streetfix.enums.Role;
import com.streetfix.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

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
        String defaultPassword = "Admin@123";
        String encodedPassword = passwordEncoder.encode(defaultPassword);

        List<UserData> defaultUsers = Arrays.asList(
                new UserData(Role.ROLE_SUPER_ADMIN, "Super Admin", "superadmin@streetfix.com"),
                new UserData(Role.ROLE_ADMIN, "Admin", "admin@streetfix.com"),
                new UserData(Role.ROLE_MUNICIPAL_COMMISSIONER, "Municipal Commissioner", "commissioner@streetfix.com"),
                new UserData(Role.ROLE_ZONAL_OFFICER, "Zonal Officer", "zonal@streetfix.com"),
                new UserData(Role.ROLE_ASSISTANT_COMMISSIONER, "Assistant Commissioner", "assistant@streetfix.com"),
                new UserData(Role.ROLE_WARD_SUPERVISOR, "Ward Supervisor", "ward@streetfix.com"),
                new UserData(Role.ROLE_OFFICER, "Officer", "officer@streetfix.com"),
                new UserData(Role.ROLE_WORKER, "Worker", "worker@streetfix.com")
        );

        System.out.println("\n--- Default Login Credentials ---");
        for (UserData data : defaultUsers) {
            if (!userRepository.existsByEmail(data.email)) {
                User user = User.builder()
                        .name(data.name)
                        .email(data.email)
                        .password(encodedPassword)
                        .role(data.role)
                        .build();
                userRepository.save(user);
            }
            System.out.println("Role: " + data.role.name() + " | Email: " + data.email + " | Password: " + defaultPassword);
        }
        System.out.println("---------------------------------\n");
    }

    private static class UserData {
        Role role;
        String name;
        String email;

        UserData(Role role, String name, String email) {
            this.role = role;
            this.name = name;
            this.email = email;
        }
    }
}
