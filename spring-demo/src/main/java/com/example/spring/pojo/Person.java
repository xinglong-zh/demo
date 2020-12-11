package com.example.spring.pojo;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Data
@Component  // 说明类被spring ioc 接管
public class Person {
    @Value("person名称")  // 注入的值
    private String name;
}
