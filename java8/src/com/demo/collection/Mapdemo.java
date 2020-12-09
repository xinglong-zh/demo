package com.demo.collection;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.TreeMap;

public class Mapdemo {
    public static void main(String[] args) {
        TreeMap<Integer,String> treeMap = new TreeMap<>();
        treeMap.put(1,"2");
        treeMap.put(3,"2");
        treeMap.put(5,"2");
        System.out.println(treeMap);

        ArrayList<Integer> integers = new ArrayList<>();
        integers.add(1);
        integers.add(2);
        integers.add(3);
        integers.add(4);
        integers.add(5);
        Integer[] array = integers.toArray(new Integer[integers.size()]);
        for(Integer integer:array){
            System.out.println(integer);
        }

        System.out.println("sk20200203.dbf".substring(2,10));

        Path path = Paths.get("D:/xxx");
        boolean exists = Files.exists(path);
        System.out.println(exists);
    }
}
