package com.example.study.controller;

import com.example.study.bean.Greeting;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.atomic.AtomicLong;

// @RestController  -  It is shorthand for including both @Controller and @ResponseBody.
@RestController
public class GreetingController {
    private static final String template = "hello ,%s";
    private final AtomicLong counter = new AtomicLong();

    @RequestMapping(value = "/greeting",method = {RequestMethod.GET})
    public Greeting greeting(@RequestParam(value = "name",defaultValue = "world") String name){
        return new Greeting(counter.incrementAndGet(),String.format(template,name));
    }

    @RequestMapping(value = "/greeting",method = {RequestMethod.POST})
    public Greeting greeting1(@RequestParam(value = "name",defaultValue = "world") String name){
        return new Greeting(counter.incrementAndGet(),String.format(template,name));
    }
}
