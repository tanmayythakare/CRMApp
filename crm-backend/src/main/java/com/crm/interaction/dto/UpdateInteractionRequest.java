package com.crm.interaction.dto;

import com.crm.interaction.InteractionType;

import java.time.Instant;

/**
 * Request DTO for updating an existing interaction.
 */
public record UpdateInteractionRequest(
        InteractionType type,
        String subject,
        String description,
        Instant interactionDate,
        Integer durationMinutes,
        String outcome
) {}
