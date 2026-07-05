package com.streetfix.service;

import com.streetfix.dto.JwtResponse;
import com.streetfix.dto.LoginRequest;
import com.streetfix.dto.MessageResponse;
import com.streetfix.dto.RegisterRequest;

public interface AuthService {
    MessageResponse registerUser(RegisterRequest registerRequest);
    JwtResponse authenticateUser(LoginRequest loginRequest);
}
