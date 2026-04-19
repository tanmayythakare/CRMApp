package com.crm.contact;

import com.crm.contact.dto.ContactDTO;
import com.crm.contact.dto.CreateContactRequest;
import com.crm.contact.dto.UpdateContactRequest;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ContactMapper {

    ContactDTO toDTO(Contact contact);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "interactions", ignore = true)
    @Mapping(target = "status", defaultExpression = "java(ContactStatus.ACTIVE)")
    Contact toEntity(CreateContactRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "interactions", ignore = true)
    void updateEntity(UpdateContactRequest request, @MappingTarget Contact contact);
}
