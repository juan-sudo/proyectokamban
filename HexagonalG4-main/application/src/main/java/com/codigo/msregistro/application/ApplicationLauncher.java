package com.codigo.msregistro.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
// Escanea las entidades en los paquetes indicados
@EntityScan(basePackages = {
        "com.codigo.msregistro.domain.aggregates",  // Entidades de domain
        "com.codigo.msregistro.infraestructure.entity"  // Entidades de infraestructure
})
// Escanea los componentes (servicios, controladores, etc.) en los paquetes indicados
@ComponentScan(basePackages = "com.codigo.msregistro")
// Escanea los repositorios en los paquetes de infraestructure y domain
@EnableJpaRepositories(basePackages = {
        "com.codigo.msregistro.infraestructure.dao",
        "com.codigo.msregistro.infraestructure.repositories"
})
// Habilita Feign para los clientes remotos
@EnableFeignClients(basePackages = "com.codigo.msregistro")
public class ApplicationLauncher {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationLauncher.class, args);
    }
}
