package com.streetfix.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SmsNotificationService {

    @Async
    public void sendSms(String phoneNumber, String message) {
        // Stub for SMS sending logic (e.g., using Twilio)
        log.info("Mock SMS sent to {}: {}", phoneNumber, message);
    }
}
