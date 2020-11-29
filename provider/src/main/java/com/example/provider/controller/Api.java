package com.example.provider.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/hello-provider")
public class Api {
    @Value("${server.port}")
    private int  serverPort=0;

    @RequestMapping("/{name}")
    public String hello(@PathVariable String name){
        log.info("provide被访问",name);
        return "hello , "+  name+ ",from provider ,port:"+serverPort;
    }
}
