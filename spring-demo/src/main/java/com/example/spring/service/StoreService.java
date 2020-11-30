package com.example.spring.service;

import com.example.spring.pojo.Animal;
import org.springframework.stereotype.Service;

/**
 * @author Administrator
 */
@Service
public interface StoreService {
   /** eat 方法 ,测试自动注入问题  */
    void eat();
}
