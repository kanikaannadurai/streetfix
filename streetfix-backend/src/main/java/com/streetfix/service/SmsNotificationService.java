package com.streetfix.service;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class SmsNotificationService {

    @Async
    public void sendSms(String phoneNumber, String message) {
        // Stub for SMS sending logic (e.g., using Twilio)
        System.out.println("Mock SMS sent to " + phoneNumber + ": " + message);
    }
}
