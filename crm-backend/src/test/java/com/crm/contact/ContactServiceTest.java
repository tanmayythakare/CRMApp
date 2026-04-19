package com.crm.contact;

import com.crm.contact.dto.ContactResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {

    @Mock
    private ContactRepository contactRepository;

    @Mock
    private ContactMapper contactMapper;

    @InjectMocks
    private ContactService contactService;

    private Contact contact;
    private ContactResponse contactResponse;

    @BeforeEach
    void setUp() {
        contact = new Contact();
        contact.setId("1");
        contact.setName("John Doe");
        contact.setEmail("john@example.com");
        contact.setStatus(ContactStatus.ACTIVE);

        contactResponse = new ContactResponse();
        contactResponse.setId("1");
        contactResponse.setName("John Doe");
        contactResponse.setEmail("john@example.com");
    }

    @Test
    void getAllContacts_ShouldReturnPageOfContacts() {
        PageRequest pageRequest = PageRequest.of(0, 10);
        Page<Contact> contactPage = new PageImpl<>(Collections.singletonList(contact));

        when(contactRepository.findAll(any(Specification.class), any(PageRequest.class))).thenReturn(contactPage);
        when(contactMapper.toResponse(any(Contact.class))).thenReturn(contactResponse);

        Page<ContactResponse> result = contactService.getAllContacts(null, null, pageRequest);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("John Doe", result.getContent().get(0).getName());
        verify(contactRepository).findAll(any(Specification.class), eq(pageRequest));
    }

    @Test
    void getContactById_WhenExists_ShouldReturnContact() {
        when(contactRepository.findById("1")).thenReturn(Optional.of(contact));
        when(contactMapper.toResponse(contact)).thenReturn(contactResponse);

        ContactResponse result = contactService.getContactById("1");

        assertNotNull(result);
        assertEquals("1", result.getId());
        verify(contactRepository).findById("1");
    }

    @Test
    void getContactById_WhenNotExists_ShouldThrowException() {
        when(contactRepository.findById("2")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> contactService.getContactById("2"));
    }

    @Test
    void deleteContact_ShouldCallRepository() {
        when(contactRepository.existsById("1")).thenReturn(true);
        doNothing().when(contactRepository).deleteById("1");

        contactService.deleteContact("1");

        verify(contactRepository).deleteById("1");
    }
}
