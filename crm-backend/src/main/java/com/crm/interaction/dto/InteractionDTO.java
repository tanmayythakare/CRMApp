package com.crm.interaction.dto;

import com.crm.interaction.InteractionType;

import java.time.Instant;
import java.util.UUID;

/**
 * Interaction data transfer object for API responses.
 */
public record InteractionDTO(
        UUID id,
        UUID contactId,
        String contactName,
        InteractionType type,
        String subject,
        String description,
        Instant interactionDate,
        Integer durationMinutes,
        String outcome,
        Instant createdAt
) {}
