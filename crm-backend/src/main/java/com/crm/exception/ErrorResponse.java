package com.crm.exception;

import java.time.Instant;

/**
 * Standard error response body returned by the API.
 */
public record ErrorResponse(
        String error,
        String message,
        Instant timestamp
) {
    public ErrorResponse(String error, String message) {
        this(error, message, Instant.now());
    }
}
