package com.codigo.msregistro.domain.ports.out;

import com.codigo.msregistro.domain.aggregates.dto.PersonaDTO;
import com.codigo.msregistro.domain.aggregates.request.PersonaRequest;

import java.util.List;
import java.util.Optional;

public interface PersonaServiceOut {
    PersonaDTO crearPersonaOut(PersonaRequest personaRequest);
    //Tarea
    Optional<PersonaDTO> obtenerPersonaOut(Long id);
    List<PersonaDTO> obtenerTodosOut();
    PersonaDTO actualizarPersonaOut(Long id, PersonaRequest personaRequest);
    PersonaDTO deleteOut(Long id);
}
