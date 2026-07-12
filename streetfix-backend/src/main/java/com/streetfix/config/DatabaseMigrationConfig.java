package com.streetfix.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class DatabaseMigrationConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseMigrationConfig.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void migratePriorityColumn() {
        try {
            logger.info("Executing database migration to fix priority column...");
            // Force the priority column to be a VARCHAR(50) so it can accept all enum values like CRITICAL.
            jdbcTemplate.execute("ALTER TABLE complaints MODIFY COLUMN priority VARCHAR(50) NOT NULL");
            logger.info("Successfully migrated priority column to VARCHAR(50).");
        } catch (Exception e) {
            logger.error("Database migration for priority column failed or already applied: " + e.getMessage());
        }
    }
}
