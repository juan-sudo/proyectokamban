package com.codigo.msregistro.domain.aggregates.request;

import org.springframework.stereotype.Service;

@Service
public class PersonaService {
    private final PersonaMapper personaMapper;

    public PersonaService(PersonaMapper personaMapper) {
        this.personaMapper = personaMapper;
    }

    public PersonaDTO getPersonaDto(PersonaEntity personaEntity) {
        return personaMapper.toDto(personaEntity);
    }

    public PersonaEntity getPersonaEntity(PersonaDTO personaDTO) {
        return personaMapper.toEntity(personaDTO);
    }
}
