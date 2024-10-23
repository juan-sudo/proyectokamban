package com.codigo.msregistro.infraestructure.repositories;

import com.codigo.msregistro.domain.aggregates.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {

    // Encontrar proyectos que no están eliminados
    List<Proyecto> findByEliminadoFalse();

    // Encontrar proyectos que están en la papelera
    List<Proyecto> findByEliminadoTrue();
}
