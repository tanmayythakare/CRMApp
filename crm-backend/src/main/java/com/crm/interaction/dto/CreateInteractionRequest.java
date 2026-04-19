package com.crm.interaction.dto;

import com.crm.interaction.InteractionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.UUID;

/**
 * Request DTO for creating a new interaction.
 */
public record CreateInteractionRequest(
        @NotNull(message = "Contact ID is required")
        UUID contactId,

        @NotNull(message = "Type is required")
        InteractionType type,

        @NotBlank(message = "Subject is required")
        String subject,

        String description,

        @NotNull(message = "Interaction date is required")
        Instant interactionDate,

        Integer durationMinutes,

        String outcome
) {}
