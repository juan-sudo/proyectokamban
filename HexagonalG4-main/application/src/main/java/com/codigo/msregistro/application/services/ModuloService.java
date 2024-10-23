package com.codigo.msregistro.application.services;

import com.codigo.msregistro.domain.aggregates.EstadoModulo;
import com.codigo.msregistro.domain.aggregates.EstadoProyecto;
import com.codigo.msregistro.infraestructure.repositories.ModuloRepository;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;


import java.util.Optional;
import com.codigo.msregistro.domain.aggregates.Modulo;
import com.codigo.msregistro.domain.aggregates.Proyecto;

@Service
@Transactional
public class ModuloService {

    private final ModuloRepository moduloRepository;

    public ModuloService(ModuloRepository moduloRepository) {
        this.moduloRepository = moduloRepository;
    }

    public Modulo crearModulo(Proyecto proyecto, Modulo modulo) {
        modulo.setProyecto(proyecto);
        modulo.setEstado(EstadoModulo.PENDIENTE);
        return moduloRepository.save(modulo);
    }

    public Optional<Modulo> obtenerModuloPorId(Long id) {
        return moduloRepository.findById(id);
    }

    // Otros métodos como actualizar, eliminar, etc.
}
