package com.streetfix.enums;

public enum EscalationLevel {
    LEVEL_0,   // No escalation – assigned officer handling
    LEVEL_1,   // 3 days – Officer Reminder
    LEVEL_2,   // 7 days – Escalated to Ward Supervisor
    LEVEL_3    // 15 days – Escalated to Municipal Commissioner + Critical Alert
}
