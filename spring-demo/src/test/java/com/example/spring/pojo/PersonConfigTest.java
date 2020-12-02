package com.example.spring.pojo;

import com.example.spring.Application;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import static org.junit.jupiter.api.Assertions.*;
//@SpringBootTest
class PersonConfigTest {

    public static void main(String[] args) {
        ApplicationContext context = new AnnotationConfigApplicationContext(PersonConfig.class);     // 完全采用配置类的话 , 需要使用AnnotationConfigApplicationContext ,加载对象 , 这些都由spring框架来做的 .
        Person bean = context.getBean(Person.class);
        System.out.println(bean);

    }
}