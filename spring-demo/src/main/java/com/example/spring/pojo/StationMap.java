package com.example.spring.pojo;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * @author Administrator
 */
@Component
@Data
@ConfigurationProperties(prefix = "station")
public class StationMap {
    private String name;
    private Map<String,Integer> map;
    private List<Integer> list;
    private List<Station> stations;
    private Map<String,Station> maps;

    @Data
    public static class Station {
        private String name;
        private String value;
    }
}
