package com.codigo.msregistro.application.services;

import com.codigo.msregistro.domain.aggregates.Modulo;
import com.codigo.msregistro.domain.aggregates.Subtarea;
import com.codigo.msregistro.domain.aggregates.Tarea;
import com.codigo.msregistro.infraestructure.repositories.SubtareaRepository;
import com.codigo.msregistro.infraestructure.repositories.TareaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubTareaService {

    private final SubtareaRepository tareaRepository;

    // Crear una nueva tarea
    public Subtarea crearTarea(Subtarea tarea) {
        return tareaRepository.save(tarea);
    }

    // Obtener todas las tareas de un módulo
    public List<Subtarea> obtenerTareasPorModulo(Tarea tarea) {
        return tareaRepository.findByTarea(tarea);
    }

    // Obtener una tarea por ID
    public Optional<Subtarea> obtenerTareaPorId(Long id) {
        return tareaRepository.findById(id);
    }

    // Actualizar una tarea
    public Subtarea actualizarTarea(Subtarea tarea) {
        return tareaRepository.save(tarea);
    }

    // Eliminar una tarea
    public void eliminarTarea(Long id) {
        tareaRepository.deleteById(id);
    }
}
