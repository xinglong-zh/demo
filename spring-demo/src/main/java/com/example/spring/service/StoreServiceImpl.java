package com.example.spring.service;

import com.example.spring.pojo.Animal;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Administrator
 */
@Service
@Data
public class StoreServiceImpl implements StoreService {

//    @Autowired
    private  Animal animal;


    @Override
    public void eat() {
        this.animal.eat();
    }
}
