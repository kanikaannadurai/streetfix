package com.streetfix.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Enables Spring's @Scheduled annotation support.
 * Required for the SlaEscalationScheduler to run background jobs.
 */
@Configuration
@EnableScheduling
public class SchedulerConfig {
    // Configuration class — no additional beans needed.
    // @EnableScheduling activates the scheduler globally.
}
