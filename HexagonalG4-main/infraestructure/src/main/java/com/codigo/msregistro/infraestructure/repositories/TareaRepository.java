package com.codigo.msregistro.infraestructure.repositories;

import com.codigo.msregistro.domain.aggregates.Tarea;
import com.codigo.msregistro.domain.aggregates.Modulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {

    // Encontrar todas las tareas por módulo
    List<Tarea> findByModulo(Modulo modulo);


}
