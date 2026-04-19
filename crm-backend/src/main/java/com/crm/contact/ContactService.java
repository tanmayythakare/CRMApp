package com.crm.contact;

import com.crm.contact.dto.ContactDTO;
import com.crm.contact.dto.CreateContactRequest;
import com.crm.contact.dto.UpdateContactRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContactService {

    private final ContactRepository contactRepository;
    private final ContactMapper contactMapper;

    /**
     * Find all contacts with optional search and status filter, paginated.
     */
    public Page<ContactDTO> findAll(Pageable pageable, String search, ContactStatus status) {
        Page<Contact> contacts;

        boolean hasSearch = search != null && !search.isBlank();
        boolean hasStatus = status != null;

        if (hasSearch && hasStatus) {
            contacts = contactRepository.findByStatusAndSearch(status, search, pageable);
        } else if (hasSearch) {
            contacts = contactRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                    search, search, pageable);
        } else if (hasStatus) {
            contacts = contactRepository.findByStatus(status, pageable);
        } else {
            contacts = contactRepository.findAll(pageable);
        }

        return contacts.map(contactMapper::toDTO);
    }

    /**
     * Find a contact by ID.
     */
    public ContactDTO findById(UUID id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contact not found with id: " + id));
        return contactMapper.toDTO(contact);
    }

    /**
     * Create a new contact.
     */
    @Transactional
    public ContactDTO create(CreateContactRequest request) {
        Contact contact = contactMapper.toEntity(request);
        Contact saved = contactRepository.save(contact);
        return contactMapper.toDTO(saved);
    }

    /**
     * Update an existing contact.
     */
    @Transactional
    public ContactDTO update(UUID id, UpdateContactRequest request) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contact not found with id: " + id));
        contactMapper.updateEntity(request, contact);
        Contact saved = contactRepository.save(contact);
        return contactMapper.toDTO(saved);
    }

    /**
     * Delete a contact by ID.
     */
    @Transactional
    public void delete(UUID id) {
        if (!contactRepository.existsById(id)) {
            throw new EntityNotFoundException("Contact not found with id: " + id);
        }
        contactRepository.deleteById(id);
    }
}
