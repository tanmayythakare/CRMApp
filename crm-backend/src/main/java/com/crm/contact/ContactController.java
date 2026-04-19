package com.crm.contact;

import com.crm.contact.dto.ContactDTO;
import com.crm.contact.dto.CreateContactRequest;
import com.crm.contact.dto.UpdateContactRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @GetMapping
    public ResponseEntity<Page<ContactDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ContactStatus status) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ContactDTO> contacts = contactService.findAll(pageable, search, status);
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(contactService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ContactDTO> create(@Valid @RequestBody CreateContactRequest request) {
        ContactDTO created = contactService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateContactRequest request) {
        return ResponseEntity.ok(contactService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        contactService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
