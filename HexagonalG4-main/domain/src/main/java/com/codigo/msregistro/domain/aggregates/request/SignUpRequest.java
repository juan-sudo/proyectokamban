package com.codigo.msregistro.domain.aggregates.request;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class SignUpRequest {
    private String nombres;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String email;
    private String password;
    private String telefono;
    private String numDoc;
    private String direccion;
    private Date fechaNacimiento;
    private String genero;

}
