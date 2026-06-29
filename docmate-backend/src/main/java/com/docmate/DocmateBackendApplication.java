package com.docmate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DocmateBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(DocmateBackendApplication.class, args);
	}

}
