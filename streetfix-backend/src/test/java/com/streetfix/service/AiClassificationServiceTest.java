package com.streetfix.service;

import com.streetfix.enums.Priority;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class AiClassificationServiceTest {

    private final AiClassificationService service = new AiClassificationService();

    @Test
    public void testClassifyCategory_RoadDamage() {
        String category = service.classifyCategory("Pothole on Main St", "There is a huge pothole and broken road.");
        assertEquals("Road Damage", category);
    }

    @Test
    public void testClassifyCategory_Garbage() {
        String category = service.classifyCategory("Trash overflowing", "Garbage bin is full of waste and smells.");
        assertEquals("Garbage", category);
    }

    @Test
    public void testDetectPriority_Critical() {
        Priority p = service.detectPriority("Live wire fallen", "Dangerous sparking live wire on the street");
        assertEquals(Priority.CRITICAL, p);
    }

    @Test
    public void testDetectPriority_MediumDefault() {
        Priority p = service.detectPriority("Need bench painted", "Park bench is fading");
        assertEquals(Priority.MEDIUM, p);
    }
}
