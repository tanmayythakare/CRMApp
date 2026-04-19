package com.crm.interaction;

import com.crm.contact.Contact;
import com.crm.contact.ContactRepository;
import com.crm.interaction.dto.InteractionResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InteractionServiceTest {

    @Mock
    private InteractionRepository interactionRepository;

    @Mock
    private ContactRepository contactRepository;

    @Mock
    private InteractionMapper interactionMapper;

    @InjectMocks
    private InteractionService interactionService;

    private Interaction interaction;
    private InteractionResponse interactionResponse;
    private Contact contact;

    @BeforeEach
    void setUp() {
        contact = new Contact();
        contact.setId("c1");
        contact.setName("John Doe");

        interaction = new Interaction();
        interaction.setId("i1");
        interaction.setContact(contact);
        interaction.setType(InteractionType.CALL);
        interaction.setSubject("Discovery Call");
        interaction.setInteractionDate(LocalDateTime.now());

        interactionResponse = new InteractionResponse();
        interactionResponse.setId("i1");
        interactionResponse.setSubject("Discovery Call");
        interactionResponse.setType("CALL");
    }

    @Test
    void getInteractions_ShouldReturnList() {
        when(interactionRepository.findByFilters(any(), any(), any())).thenReturn(Collections.singletonList(interaction));
        when(interactionMapper.toResponse(any())).thenReturn(interactionResponse);

        List<InteractionResponse> result = interactionService.getInteractions("c1", 30, InteractionType.CALL);

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals("Discovery Call", result.get(0).getSubject());
        verify(interactionRepository).findByFilters(eq("c1"), any(LocalDateTime.class), eq(InteractionType.CALL));
    }

    @Test
    void createInteraction_WhenContactExists_ShouldSave() {
        when(contactRepository.findById("c1")).thenReturn(Optional.of(contact));
        when(interactionMapper.toEntity(any())).thenReturn(interaction);
        when(interactionRepository.save(any())).thenReturn(interaction);
        when(interactionMapper.toResponse(any())).thenReturn(interactionResponse);

        InteractionResponse result = interactionService.createInteraction(null); // Request DTO not mocked here for brevity

        assertNotNull(result);
        verify(interactionRepository).save(any());
        verify(contactRepository).findById("c1");
    }
}
