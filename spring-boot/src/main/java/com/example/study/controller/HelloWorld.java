package com.example.study.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/demo")
public class HelloWorld {

    /**
     * hello world demo from spring-boot website .
     * @param name
     * @return
     */
    @RequestMapping("/hello")
    public String hello(@RequestParam(value = "name",defaultValue = "world") String name){
        return String.format("hello %s!",name);

    }
}
