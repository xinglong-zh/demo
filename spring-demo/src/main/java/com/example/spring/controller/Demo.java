package com.example.spring.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Random;

/**
 * @author Administrator
 */
@RestController
public class Demo {
    @RequestMapping(value = "/hi")
    public ArrayList hello(){
        new Random().nextInt();

       ArrayList arrayList = new ArrayList();
       arrayList.add("123");
        return arrayList;
    }
}
