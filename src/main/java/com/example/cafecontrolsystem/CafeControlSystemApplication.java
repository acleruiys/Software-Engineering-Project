package com.example.cafecontrolsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CafeControlSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(CafeControlSystemApplication.class, args);
	}

}
