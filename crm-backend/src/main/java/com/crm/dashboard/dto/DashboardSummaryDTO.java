package com.crm.dashboard.dto;

/**
 * Dashboard summary statistics.
 */
public record DashboardSummaryDTO(
        long totalContacts,
        long activeContacts,
        long interactionsThisWeek,
        long followUpsDue
) {}
