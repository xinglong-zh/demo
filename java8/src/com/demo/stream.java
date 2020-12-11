package com.demo;

import java.io.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.stream.Collectors;


public class stream {
    public static void main(String[] args) throws IOException {
        List<Integer> list = new ArrayList(){{add(1);add(2);add(3);}};
        Integer reduce = list.stream().reduce(0, Integer::sum);
        System.out.println(reduce);
        System.out.println(list);

        int sum = list.stream().mapToInt(Integer::intValue).sum();
        System.out.println(sum);

        System.out.println(Math.sqrt(16));
        System.out.println(Math.pow(2,5));
        List<Address> list1 = new ArrayList<>();
        list1.add(new Address("小李",12));
        list1.add(new Address("小张",23));
        list1.add(new Address("小张",22));

        HashMap<String, List<Address>> collect = list1.stream().collect(Collectors.groupingBy(i -> i.getName(), HashMap::new, Collectors.toList()));

        System.out.println(collect);

        List<Address> list2 = collect.get("小张");

        list2.stream().forEach(System.out::println);

        list.clear();
        for (int i = 0; i < 36; i++) {
            list.add(i);
        }

        list.stream().filter(integer -> integer%3==0).forEach(System.out::println);
    }
}
