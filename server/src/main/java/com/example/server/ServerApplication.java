package com.example.server;

import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableDiscoveryClient
@RestController
@EnableFeignClients

public class ServerApplication {

    @RequestMapping("/")
    public String hello(){
        return "hello,world";
    }

    public static void main(String[] args) {

//        SpringApplication.run(ServerApplication.class, args);
        new SpringApplicationBuilder(ServerApplication.class).web(WebApplicationType.SERVLET).run(args);
    }

}
