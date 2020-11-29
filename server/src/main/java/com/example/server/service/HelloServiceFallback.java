package com.example.server.service;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

// hello 降级实现
@Component
public class HelloServiceFallback  {
    public String hello(String name) {
        return "hello ," + name +", i am fallback";
    }
}
