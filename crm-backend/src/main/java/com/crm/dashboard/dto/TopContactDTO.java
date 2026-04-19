package com.crm.dashboard.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * Top contact with interaction statistics.
 */
public record TopContactDTO(
        UUID contactId,
        String contactName,
        long interactionCount,
        Instant lastInteractionDate
) {}
