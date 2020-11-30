package com.example.spring.pojo;

import org.springframework.context.annotation.Configuration;

/**
 * @author Administrator
 */
@Configuration
public class AnimalConfig {
    public static Animal getAnimal(){
        return new Cat("小蓝","白色");
    }
}
