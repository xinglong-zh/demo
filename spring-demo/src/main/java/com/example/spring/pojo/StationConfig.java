package com.example.spring.pojo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author Administrator
 */
@Configuration
public class StationConfig {
//    @Bean
    public StationMap stationMap(){
        return new StationMap();
    }
}
