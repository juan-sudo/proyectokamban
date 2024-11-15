package com.codigo.msregistro.application.services;



import com.codigo.msregistro.domain.aggregates.Usuario;
import com.codigo.msregistro.domain.aggregates.request.SignInRequest;
import com.codigo.msregistro.domain.aggregates.request.SignUpRequest;
import com.codigo.msregistro.domain.aggregates.response.AuthenticationResponse;

import java.util.List;

public interface AuthenticationService {
    Usuario signUpUser(SignUpRequest signUpRequest);
    Usuario signUpAdmin(SignUpRequest signUpRequest);
    List<Usuario> todos();
    AuthenticationResponse signin(SignInRequest signInRequest);
    boolean validateToken(String token);


}

