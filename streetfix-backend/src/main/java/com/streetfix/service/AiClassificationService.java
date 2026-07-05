package com.streetfix.service;

import com.streetfix.enums.Priority;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Rule-based AI Engine for automatic complaint categorization and priority detection.
 */
@Service
public class AiClassificationService {

    // Common severity keywords
    private static final List<String> CRITICAL_KEYWORDS = Arrays.asList(
            "fire", "live wire", "burst", "accident", "emergency", "danger", "hazard", "fatal", "sparking", "collapse"
    );
    
    private static final List<String> HIGH_KEYWORDS = Arrays.asList(
            "leak", "block", "overflow", "smell", "dark", "broken", "deep pothole", "no water"
    );

    // Map of categories to their associated keywords
    private static final Map<String, List<String>> CATEGORY_KEYWORDS = new HashMap<>();
    
    static {
        CATEGORY_KEYWORDS.put("Garbage", Arrays.asList("garbage", "trash", "waste", "dustbin", "litter", "dump", "smell"));
        CATEGORY_KEYWORDS.put("Street Light", Arrays.asList("light", "lamp", "dark", "street light", "bulb", "pole"));
        CATEGORY_KEYWORDS.put("Road Damage", Arrays.asList("pothole", "road", "crack", "asphalt", "broken road", "uneven"));
        CATEGORY_KEYWORDS.put("Water Leakage", Arrays.asList("water", "leak", "pipe", "burst", "flowing", "tap"));
        CATEGORY_KEYWORDS.put("Drainage", Arrays.asList("drain", "clog", "block", "waterlogging", "storm water"));
        CATEGORY_KEYWORDS.put("Sewage", Arrays.asList("sewage", "gutter", "overflow", "foul smell", "stink", "manhole"));
        CATEGORY_KEYWORDS.put("Tree Maintenance", Arrays.asList("tree", "branch", "fallen", "prune", "cutting", "leaves"));
        CATEGORY_KEYWORDS.put("Public Property Damage", Arrays.asList("bench", "park", "statue", "signboard", "vandalism"));
    }

    /**
     * Determines the most appropriate category based on title and description.
     */
    public String classifyCategory(String title, String description) {
        String combinedText = (title + " " + description).toLowerCase();
        
        String bestCategory = "Other";
        int maxMatches = 0;

        for (Map.Entry<String, List<String>> entry : CATEGORY_KEYWORDS.entrySet()) {
            int matchCount = 0;
            for (String keyword : entry.getValue()) {
                if (combinedText.contains(keyword)) {
                    matchCount++;
                }
            }
            if (matchCount > maxMatches) {
                maxMatches = matchCount;
                bestCategory = entry.getKey();
            }
        }
        
        return bestCategory;
    }

    /**
     * Detects severity level to assign priority.
     */
    public Priority detectPriority(String title, String description) {
        String combinedText = (title + " " + description).toLowerCase();

        for (String keyword : CRITICAL_KEYWORDS) {
            if (combinedText.contains(keyword)) {
                return Priority.CRITICAL;
            }
        }

        for (String keyword : HIGH_KEYWORDS) {
            if (combinedText.contains(keyword)) {
                return Priority.HIGH;
            }
        }

        return Priority.MEDIUM; // Default priority if no severe keywords found
    }
}
