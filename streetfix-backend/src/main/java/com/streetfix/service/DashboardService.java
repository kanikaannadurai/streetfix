package com.streetfix.service;

import java.util.Map;

public interface DashboardService {
    Map<String, Object> getAdminDashboard();
    Map<String, Object> getOfficerDashboard(String email);
    Map<String, Object> getCitizenDashboard(String email);
}
