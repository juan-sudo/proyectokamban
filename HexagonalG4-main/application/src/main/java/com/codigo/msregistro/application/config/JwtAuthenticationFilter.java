package com.codigo.msregistro.application.config;

import com.codigo.msregistro.application.services.JwtService;
import com.codigo.msregistro.application.services.UsuarioServicenuevo;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Objects;

@Component
@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioServicenuevo usuarioService;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final String tokenExtraidoHeader = request.getHeader("Authorization");
        System.out.println("Token extraído: " + tokenExtraidoHeader);
        final String jwt;
        final String userEmail;

        if(StringUtils.isEmpty(tokenExtraidoHeader) || !StringUtils.startsWithIgnoreCase(tokenExtraidoHeader, "Bearer ")){
            filterChain.doFilter(request,response);
            return;
        }

        jwt = tokenExtraidoHeader.substring(7);
        userEmail = jwtService.extractUserName(jwt);

        if(Objects.nonNull(userEmail) && SecurityContextHolder.getContext().getAuthentication() == null){
            UserDetails userDetails = usuarioService.userDetailService().loadUserByUsername(userEmail);
            if(jwtService.validateToken(jwt,userDetails)){
                SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails,null,userDetails.getAuthorities()
                );
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                securityContext.setAuthentication(authenticationToken);
                SecurityContextHolder.setContext(securityContext);
            }
        }
        filterChain.doFilter(request,response);

    }
}
