package com.streetfix;

import com.streetfix.dto.ComplaintRequest;
import com.streetfix.dto.ComplaintResponse;
import com.streetfix.entity.User;
import com.streetfix.enums.Role;
import com.streetfix.repository.UserRepository;
import com.streetfix.service.ComplaintService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@Transactional
public class ComplaintSubmissionTest {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testComplaintSubmission() {
        // Given a citizen exists
        User citizen = new User();
        citizen.setName("Test Citizen");
        citizen.setEmail("testcitizen@example.com");
        citizen.setPassword("password");
        citizen.setRole(Role.ROLE_CITIZEN);
        citizen.setPhone("1234567890");
        userRepository.save(citizen);

        // When citizen submits a complaint
        ComplaintRequest request = new ComplaintRequest();
        request.setTitle("Deep Pothole on Main St");
        request.setDescription("There is a large pothole causing traffic issues.");
        request.setLatitude(12.34);
        request.setLongitude(56.78);
        request.setAddress("Main St");

        ComplaintResponse response = complaintService.createComplaint(request, citizen.getEmail());

        // Then the complaint is successfully saved and returned without SQL truncation errors
        assertNotNull(response.getId(), "Complaint ID should not be null");
        assertEquals("PENDING", response.getStatus().name());
        assertEquals("Road Damage", response.getCategory(), "AI should classify as Road Damage");
        assertNotNull(response.getPriority(), "AI should assign a priority");
        
        System.out.println("✅ Complaint successfully inserted into MySQL");
        System.out.println("✅ No SQL exception occurred");
    }
}
