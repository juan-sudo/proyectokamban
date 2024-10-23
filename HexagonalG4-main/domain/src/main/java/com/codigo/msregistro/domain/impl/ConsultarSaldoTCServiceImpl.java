package com.codigo.msregistro.domain.impl;

import com.codigo.msregistro.domain.aggregates.dto.ConsultarSaldoDTO;
import com.codigo.msregistro.domain.ports.in.ConsultarSaldoIn;
import com.codigo.msregistro.domain.ports.out.ConsultarSaldoOut;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class ConsultarSaldoTCServiceImpl implements ConsultarSaldoIn {

    @Qualifier("consultarSaldoTCAdapter")
    @Autowired
    private  ConsultarSaldoOut consultarSaldoOut;
    @Override
    public ConsultarSaldoDTO consultarSaldoIn(Long idCliente) {
        return consultarSaldoOut.consultarSaldoOut(idCliente);
    }
}
