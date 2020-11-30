package com.example.study;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Test {
    public static void main(String[] args) throws IOException {
        Path path = Paths.get("D:/GRIB/gh/800");
//        System.out.println(path);
        List<Path> paths = Files.list(path).collect(Collectors.toList());
//        for(Path p:paths){
////            System.out.println(p);
//            System.out.println(p.getFileName());
//        }
        Double d= -1D;
        System.out.println(d<0);
    }
}
