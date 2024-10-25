package com.codigo.msregistro.infraestructure.repositories;

import com.codigo.msregistro.domain.aggregates.Modulo;
import com.codigo.msregistro.domain.aggregates.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}
