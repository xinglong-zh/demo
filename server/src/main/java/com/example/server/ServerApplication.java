package com.example.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableDiscoveryClient
@RestController
@EnableFeignClients(basePackages ="com.example")
public class ServerApplication {

    @RequestMapping("/")
    public String hello(){
        return "hello,world";
    }

    @LoadBalanced
    @Bean(value = "restTemplate")
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }

    public static void main(String[] args) {

//        SpringApplication.run(ServerApplication.class, args);
        new SpringApplicationBuilder(ServerApplication.class).web(WebApplicationType.SERVLET).run(args);
    }

}
