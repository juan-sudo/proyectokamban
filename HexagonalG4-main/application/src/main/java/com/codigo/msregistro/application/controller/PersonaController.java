package com.codigo.msregistro.application.controller;

import com.codigo.msregistro.domain.aggregates.dto.PersonaDTO;
import com.codigo.msregistro.domain.aggregates.request.PersonaRequest;
import com.codigo.msregistro.domain.ports.in.PersonaServiceIn;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ms-registro/v1/persona")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class PersonaController {
    private final PersonaServiceIn personaServiceIn;

    @PostMapping
    public ResponseEntity<PersonaDTO> registrar(@RequestBody PersonaRequest requestPersona){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(personaServiceIn.crearPersonaIn(requestPersona));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonaDTO> buscarxId(@PathVariable Long id){
        return ResponseEntity
                .ok(personaServiceIn.obtenerPersonaIn(id).get());
    }
    @GetMapping()
    public ResponseEntity<List<PersonaDTO>> obtenerTodos() {
        List<PersonaDTO> personas = personaServiceIn.obtenerTodosIn(); // Asegúrate de que este método devuelve List<PersonaDTO>
        return ResponseEntity.ok(personas);
    }


}
