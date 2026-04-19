package com.crm.contact.dto;

import com.crm.contact.ContactStatus;

import java.time.Instant;
import java.util.UUID;

/**
 * Contact data transfer object for API responses.
 */
public record ContactDTO(
        UUID id,
        String name,
        String email,
        String phone,
        String company,
        String role,
        ContactStatus status,
        String notes,
        Instant createdAt,
        Instant updatedAt
) {}
