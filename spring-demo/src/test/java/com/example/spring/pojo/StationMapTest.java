package com.example.spring.pojo;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.*;


@RunWith(SpringRunner.class)
@SpringBootTest
public class StationMapTest {
    @Autowired
    StationMap stationMap;

    @Test
   public void getName(){
       System.out.println(stationMap.toString());
   }
}