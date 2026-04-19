package com.crm.dashboard.dto;

import java.time.LocalDate;

/**
 * Daily interaction count for chart data.
 */
public record DailyInteractionCountDTO(
        LocalDate date,
        long count
) {}
