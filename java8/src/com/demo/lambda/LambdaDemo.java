package com.demo.lambda;

import java.util.Arrays;

/**
 * λ lambda 表达式  , 可以简化代码 ,
 * lambda表达式是一个可传递的代码块，可以在以后执行一次或多次
 *
 * demo 按照字符的长度排序
 */
public class LambdaDemo {
    public static void main(String[] args) {
        String[] strings = {"hello","world","java"};
        System.out.println(Arrays.toString(strings));
        Arrays.sort(strings,(String first,String second)->{return first.length()-second.length();});
        Arrays.sort(strings,(String first,String second)->{return first.length()-second.length();});
        System.out.println(Arrays.toString(strings));
    }
}
