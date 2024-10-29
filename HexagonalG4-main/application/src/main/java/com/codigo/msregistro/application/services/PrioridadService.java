package com.codigo.msregistro.application.services;

import com.codigo.msregistro.application.exceptions.ResourceNotFoundException;
import com.codigo.msregistro.domain.aggregates.Prioridad;
import com.codigo.msregistro.domain.aggregates.Subtarea;
import com.codigo.msregistro.domain.aggregates.Tarea;
import com.codigo.msregistro.domain.aggregates.Usuario;
import com.codigo.msregistro.infraestructure.repositories.PrioridadRepository;
import com.codigo.msregistro.infraestructure.repositories.SubtareaRepository;
import com.codigo.msregistro.infraestructure.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PrioridadService {

    private final PrioridadRepository prioridadRepository;

    private final UsuarioRepository usuarioRepository;

    // Crear una nueva tarea
    public Prioridad crearPrioridad(Prioridad tarea) {
        return prioridadRepository.save(tarea);
    }

    // Obtener una tarea por ID
    public Optional<Prioridad> obtenerPrioridadorId(Long id) {
        return prioridadRepository.findById(id);
    }

    // Actualizar una tarea
    public Prioridad actualizarPrioridad(Prioridad tarea) {
        return prioridadRepository.save(tarea);
    }

    // Eliminar una tarea
    public void eliminarEliminar(Long id) {
        prioridadRepository.deleteById(id);
    }

public  List<Prioridad> getALl(){
        return prioridadRepository.findAll();
}


}
