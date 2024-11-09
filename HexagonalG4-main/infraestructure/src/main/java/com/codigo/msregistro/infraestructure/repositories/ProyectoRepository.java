package com.codigo.msregistro.infraestructure.repositories;

import com.codigo.msregistro.domain.aggregates.EstadoProyecto;
import com.codigo.msregistro.domain.aggregates.Proyecto;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {

    // Encontrar proyectos que no están eliminados
    List<Proyecto> findByEliminadoFalse();

    // Encontrar proyectos que están en la papelera
    List<Proyecto> findByEliminadoTrue();

    // Método para listar proyectos cuyo estado es diferente de ARCHIVADO y eliminado es false
    List<Proyecto> findByEstadoNotAndEliminadoFalse(EstadoProyecto estado, Sort sort);


    // Método para listar proyectos cuyo estado es ARCHIVADO
    List<Proyecto> findByEstado(EstadoProyecto estado);
}
