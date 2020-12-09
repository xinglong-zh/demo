package com.example.spring.pojo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

@Configuration  //代表这一个配置类 ,beans.xml 相同作用  被spring容器托管  ,注册到容器中  @Component
public class PersonConfig {

//    @Bean  // 注册一个bean ,相当于 <bean id="方法名" class="返回值" scope="@scope" >
    @Scope("singleton")
    public Person person(){
        return new Person();
    }
}
