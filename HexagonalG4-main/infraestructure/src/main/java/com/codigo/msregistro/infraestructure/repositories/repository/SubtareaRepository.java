package com.codigo.msregistro.infraestructure.repositories.repository;

import com.codigo.msregistro.domain.aggregates.Subtarea;
import com.codigo.msregistro.domain.aggregates.Tarea;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubtareaRepository extends JpaRepository<Subtarea, Long> {
    List<Subtarea> findByTarea(Tarea tarea);

    List<Subtarea> findAll(Sort sort);
}
