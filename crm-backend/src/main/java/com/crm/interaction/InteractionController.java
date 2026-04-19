package com.crm.interaction;

import com.crm.interaction.dto.CreateInteractionRequest;
import com.crm.interaction.dto.InteractionDTO;
import com.crm.interaction.dto.UpdateInteractionRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/interactions")
@RequiredArgsConstructor
public class InteractionController {

    private final InteractionService interactionService;

    @GetMapping
    public ResponseEntity<List<InteractionDTO>> getAll(
            @RequestParam(required = false) UUID contactId,
            @RequestParam(defaultValue = "30") int days,
            @RequestParam(required = false) InteractionType type) {

        List<InteractionDTO> interactions;

        if (contactId != null) {
            interactions = interactionService.findByContactId(contactId);
        } else if (type != null) {
            interactions = interactionService.findByType(type);
        } else {
            interactions = interactionService.findRecent(days);
        }

        return ResponseEntity.ok(interactions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InteractionDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(interactionService.findById(id));
    }

    @PostMapping
    public ResponseEntity<InteractionDTO> create(@Valid @RequestBody CreateInteractionRequest request) {
        InteractionDTO created = interactionService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InteractionDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateInteractionRequest request) {
        return ResponseEntity.ok(interactionService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        interactionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
