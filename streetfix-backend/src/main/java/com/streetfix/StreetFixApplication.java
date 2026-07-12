package com.streetfix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.cache.annotation.EnableCaching;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
@EnableCaching
public class StreetFixApplication {

	public static void main(String[] args) {
		SpringApplication.run(StreetFixApplication.class, args);
	}

	@Bean
	public CommandLineRunner dbMigration(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				jdbcTemplate.execute("ALTER TABLE complaints MODIFY COLUMN status ENUM('PENDING', 'ASSIGNED_TO_ZONAL_OFFICER', 'ASSIGNED_TO_ASSISTANT_COMMISSIONER', 'ASSIGNED_TO_WARD_SUPERVISOR', 'ASSIGNED_TO_WORKER', 'WORK_COMPLETED', 'VERIFIED_BY_WARD_SUPERVISOR', 'APPROVED_BY_ASSISTANT_COMMISSIONER', 'APPROVED_BY_ZONAL_OFFICER', 'RESOLVED') NOT NULL");
				jdbcTemplate.execute("ALTER TABLE complaints MODIFY COLUMN priority ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'LOW') NOT NULL");
				System.out.println("Database columns updated successfully to strict ENUMs");
			} catch (Exception e) {
				System.out.println("Could not alter columns: " + e.getMessage());
			}
		};
	}
}
