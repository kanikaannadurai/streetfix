package com.streetfix.enums;

public enum SlaStatus {
    ACTIVE,      // SLA timer is running, not yet breached
    WARNING,     // Within warning threshold (e.g., 24 hours before breach)
    BREACHED,    // SLA deadline has passed without resolution
    RESOLVED     // Complaint was resolved before SLA breach
}
