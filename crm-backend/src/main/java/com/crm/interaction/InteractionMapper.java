package com.crm.interaction;

import com.crm.interaction.dto.InteractionDTO;
import com.crm.interaction.dto.CreateInteractionRequest;
import com.crm.interaction.dto.UpdateInteractionRequest;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface InteractionMapper {

    @Mapping(source = "contact.id", target = "contactId")
    @Mapping(source = "contact.name", target = "contactName")
    InteractionDTO toDTO(Interaction interaction);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "contact", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Interaction toEntity(CreateInteractionRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "contact", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(UpdateInteractionRequest request, @MappingTarget Interaction interaction);
}
