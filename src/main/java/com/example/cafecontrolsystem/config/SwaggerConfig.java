package com.example.cafecontrolsystem.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI(){
        Info info = new Info()
                .title("Swagger CafeControlSystem API Document")
                .version("v0.0.1")
                .description("API 명세서");

        return new OpenAPI()
                .components(new Components())
                .info(info);
    }
}
