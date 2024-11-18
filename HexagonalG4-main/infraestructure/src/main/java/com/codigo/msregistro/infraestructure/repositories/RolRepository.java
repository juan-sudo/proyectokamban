package com.codigo.msregistro.infraestructure.repositories;


import com.codigo.msregistro.domain.aggregates.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol,Long> {

    Optional<Rol> findByNombreRol(String rol);

    List<Rol> findAllByOrderByIdRolAsc();
}
