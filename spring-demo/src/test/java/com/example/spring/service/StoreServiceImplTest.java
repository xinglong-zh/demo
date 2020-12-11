package com.example.spring.service;

import com.example.spring.pojo.Animal;
import com.example.spring.pojo.Cat;
import com.sun.org.apache.bcel.internal.generic.ACONST_NULL;
import org.springframework.beans.factory.groovy.GroovyBeanDefinitionReader;
import org.springframework.beans.factory.xml.XmlBeanDefinitionReader;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.context.support.GenericApplicationContext;

import static org.junit.Assert.*;

public class StoreServiceImplTest {
    public static void main(String[] args) {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("beans.xml");
        StoreService service = applicationContext.getBean(StoreService.class);
        service.eat();

//        GenericApplicationContext context = new GenericApplicationContext();
//        new XmlBeanDefinitionReader(context).loadBeanDefinitions("beans.xml");
//
//        context.refresh();
//        StoreService contextBean = context.getBean(StoreService.class);
//        contextBean.eat();
    }
}