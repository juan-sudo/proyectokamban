package com.codigo.msregistro.domain.aggregates.request;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PersonaMapper {

    @Mapping(source = "edad", target = "nombre") // Mapea campos que pueden tener nombres diferentes
    PersonaDTO toDto(PersonaEntity personaEntity);

    PersonaEntity toEntity(PersonaDTO personaDTO);
}
