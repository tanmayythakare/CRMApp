package com.crm.interaction;

import com.crm.contact.Contact;
import com.crm.contact.ContactRepository;
import com.crm.interaction.dto.CreateInteractionRequest;
import com.crm.interaction.dto.InteractionDTO;
import com.crm.interaction.dto.UpdateInteractionRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InteractionService {

    private final InteractionRepository interactionRepository;
    private final InteractionMapper interactionMapper;
    private final ContactRepository contactRepository;

    /**
     * Find interactions by contact ID, sorted by date descending.
     */
    public List<InteractionDTO> findByContactId(UUID contactId) {
        return interactionRepository.findByContactIdOrderByInteractionDateDesc(contactId)
                .stream()
                .map(interactionMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Find recent interactions within the given number of days.
     */
    public List<InteractionDTO> findRecent(int days) {
        Instant since = Instant.now().minus(days, ChronoUnit.DAYS);
        return interactionRepository.findByInteractionDateAfterOrderByInteractionDateDesc(since)
                .stream()
                .map(interactionMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Find an interaction by ID.
     */
    public InteractionDTO findById(UUID id) {
        Interaction interaction = interactionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Interaction not found with id: " + id));
        return interactionMapper.toDTO(interaction);
    }

    /**
     * Create a new interaction.
     */
    @Transactional
    public InteractionDTO create(CreateInteractionRequest request) {
        Contact contact = contactRepository.findById(request.contactId())
                .orElseThrow(() -> new EntityNotFoundException("Contact not found with id: " + request.contactId()));

        Interaction interaction = interactionMapper.toEntity(request);
        interaction.setContact(contact);
        Interaction saved = interactionRepository.save(interaction);
        return interactionMapper.toDTO(saved);
    }

    /**
     * Update an existing interaction.
     */
    @Transactional
    public InteractionDTO update(UUID id, UpdateInteractionRequest request) {
        Interaction interaction = interactionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Interaction not found with id: " + id));
        interactionMapper.updateEntity(request, interaction);
        Interaction saved = interactionRepository.save(interaction);
        return interactionMapper.toDTO(saved);
    }

    /**
     * Delete an interaction by ID.
     */
    @Transactional
    public void delete(UUID id) {
        if (!interactionRepository.existsById(id)) {
            throw new EntityNotFoundException("Interaction not found with id: " + id);
        }
        interactionRepository.deleteById(id);
    }

    /**
     * Find all interactions filtered by type.
     */
    public List<InteractionDTO> findByType(InteractionType type) {
        return interactionRepository.findByTypeOrderByInteractionDateDesc(type)
                .stream()
                .map(interactionMapper::toDTO)
                .collect(Collectors.toList());
    }
}
