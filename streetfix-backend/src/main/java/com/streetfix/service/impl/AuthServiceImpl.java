package com.streetfix.service.impl;

import com.streetfix.dto.JwtResponse;
import com.streetfix.dto.LoginRequest;
import com.streetfix.dto.MessageResponse;
import com.streetfix.dto.RegisterRequest;
import com.streetfix.entity.User;
import com.streetfix.enums.Role;
import com.streetfix.repository.UserRepository;
import com.streetfix.security.JwtUtils;
import com.streetfix.security.UserDetailsImpl;
import com.streetfix.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final com.streetfix.repository.WorkerRepository workerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthServiceImpl(UserRepository userRepository, 
                           com.streetfix.repository.WorkerRepository workerRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.workerRepository = workerRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public MessageResponse registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role role;
        try {
            role = Role.valueOf("ROLE_" + registerRequest.getRole().toUpperCase());
        } catch (Exception e) {
            role = Role.ROLE_CITIZEN;
        }

        User user = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(role)
                .phone(registerRequest.getPhone())
                .address(registerRequest.getAddress())
                .build();

        User savedUser = userRepository.save(user);

        if (role == Role.ROLE_WORKER) {
            com.streetfix.entity.Worker worker = com.streetfix.entity.Worker.builder()
                    .user(savedUser)
                    .specialization("General")
                    .build();
            workerRepository.save(worker);
        }

        return new MessageResponse("User registered successfully!");
    }

    @Override
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        return new JwtResponse(jwt, userDetails.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    @Override
    public java.util.Optional<User> getCurrentUser(String email) {
        return userRepository.findByEmail(email);
    }
}
