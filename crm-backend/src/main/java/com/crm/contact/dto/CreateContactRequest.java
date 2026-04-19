package com.crm.contact.dto;

import com.crm.contact.ContactStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for creating a new contact.
 */
public record CreateContactRequest(
        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        String phone,
        String company,
        String role,
        ContactStatus status,
        String notes
) {}
