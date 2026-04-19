package com.crm.contact.dto;

import com.crm.contact.ContactStatus;
import jakarta.validation.constraints.Email;

/**
 * Request DTO for updating an existing contact.
 */
public record UpdateContactRequest(
        String name,

        @Email(message = "Email must be valid")
        String email,

        String phone,
        String company,
        String role,
        ContactStatus status,
        String notes
) {}
