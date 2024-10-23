package com.codigo.msregistro.application.controller;

import com.codigo.msregistro.domain.aggregates.dto.ConsultarSaldoDTO;
import com.codigo.msregistro.domain.aggregates.dto.PersonaDTO;
import com.codigo.msregistro.domain.aggregates.request.PersonaRequest;
import com.codigo.msregistro.domain.ports.in.ConsultarSaldoIn;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ms-registro/v1/consulta-saldo")
public class ConsultarSaldoController {


    @Qualifier("consultarSaldoTCServiceImpl")
    @Autowired
    private  ConsultarSaldoIn consultarSaldoTCIn;

    @Qualifier("consultarSaldoTDServiceImpl")
    @Autowired
    private  ConsultarSaldoIn consultarSaldoTDIn;


    @GetMapping("/TC/{id}")
    public ResponseEntity<ConsultarSaldoDTO> consultarSaldoTC(@PathVariable Long id){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(consultarSaldoTCIn.consultarSaldoIn(id));
    }

    @GetMapping("/TD/{id}")
    public ResponseEntity<ConsultarSaldoDTO> consultarSaldoTD(@PathVariable Long id){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(consultarSaldoTDIn.consultarSaldoIn(id));
    }
}
