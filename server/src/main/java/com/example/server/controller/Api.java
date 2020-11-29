package com.example.server.controller;

import com.example.server.service.HelloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hello")
public class Api {

    @Autowired
    private HelloService helloService;

    @RequestMapping(value = "/{name}",method = RequestMethod.GET)
    public String hello(@PathVariable String name){
        return this.helloService.hello(name);
    }
}
