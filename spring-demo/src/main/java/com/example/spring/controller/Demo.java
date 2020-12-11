package com.example.spring.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Administrator
 */
@RestController
public class Demo {
    @RequestMapping(value = "/hi",method = RequestMethod.POST)
    public AccuracyRequest hello(@RequestBody AccuracyRequest accuracyRequest){
        System.out.println(accuracyRequest);
        return accuracyRequest;
    }
}
