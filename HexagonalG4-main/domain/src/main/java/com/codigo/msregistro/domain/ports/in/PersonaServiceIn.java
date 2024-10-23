package com.codigo.msregistro.domain.ports.in;

import com.codigo.msregistro.domain.aggregates.dto.PersonaDTO;
import com.codigo.msregistro.domain.aggregates.request.PersonaRequest;

import java.util.List;
import java.util.Optional;

public interface PersonaServiceIn {
    PersonaDTO crearPersonaIn(PersonaRequest personaRequest);
    //Tarea
    Optional<PersonaDTO> obtenerPersonaIn(Long id);
    List<PersonaDTO> obtenerTodosIn();
    PersonaDTO actualizarPersonaIn(Long id, PersonaRequest personaRequest);
    PersonaDTO deleteIn(Long id);


}
