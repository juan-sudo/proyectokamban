package com.codigo.msregistro.infraestructure.mapper;
import com.codigo.msregistro.domain.aggregates.dto.PersonaDTO;

import com.codigo.msregistro.infraestructure.entity.PersonaEntity;
import org.springframework.stereotype.Service;

@Service
public class PersonaMapper {
    public static PersonaDTO fromEntity(PersonaEntity entity) {
        PersonaDTO dto = new PersonaDTO();
        dto.setIdPersona(entity.getIdPersona());
        dto.setNumDocu(entity.getNumDocu());
        dto.setNombres(entity.getNombres());
        dto.setApePat(entity.getApePat());
        dto.setApeMat(entity.getApeMat());
        dto.setEstado(entity.getEstado());
        dto.setUsuaCrea(entity.getUsuaCrea());
        dto.setDateCreate(entity.getDateCreate());
        dto.setUsuaModif(entity.getUsuaModif());
        dto.setDateModif(entity.getDateModif());
        dto.setUsuaDelet(entity.getUsuaDelet());
        dto.setDateDelet(entity.getDateDelet());
        return dto;
    }
}
