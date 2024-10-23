package com.codigo.msregistro.infraestructure.adapters;

import com.codigo.msregistro.domain.aggregates.dto.ConsultarSaldoDTO;
import com.codigo.msregistro.domain.ports.out.ConsultarSaldoOut;
import org.springframework.stereotype.Service;

@Service
public class ConsultarSaldoTCAdapter implements ConsultarSaldoOut {
    @Override
    public ConsultarSaldoDTO consultarSaldoOut(Long idCliente) {
        ConsultarSaldoDTO consultarSaldoDTO = new ConsultarSaldoDTO();
        consultarSaldoDTO.setNumeroCuenta("123456789-123-465");
        consultarSaldoDTO.setNumeroDoc("7203212365");
        consultarSaldoDTO.setTipoCuenta("Cuenta CREDITO");
        consultarSaldoDTO.setSaldo(1234.25);
        return consultarSaldoDTO;
    }
}
