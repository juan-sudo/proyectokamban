package com.codigo.msregistro.infraestructure.repositories;

import com.codigo.msregistro.domain.aggregates.EstadoProyecto;
import com.codigo.msregistro.domain.aggregates.Proyecto;
import com.codigo.msregistro.domain.aggregates.Usuario;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.codigo.msregistro.domain.aggregates.Modulo;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModuloRepository extends JpaRepository<Modulo, Long> {
    // Método para listar proyectos cuyo estado es diferente de ARCHIVADO y ordenados
    List<Modulo> findAll(Sort sort);

}
