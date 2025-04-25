package com.dhu.dhusoftware;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DhuSoftwareApplication {

    public static void main(String[] args) {
        SpringApplication.run(DhuSoftwareApplication.class, args);
    }

}
