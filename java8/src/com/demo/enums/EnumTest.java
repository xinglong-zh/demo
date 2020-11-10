package com.demo.enums;

/**
 * 枚举值  比较实用 ==   不使用equals
 */
public class EnumTest {
    public static void main(String[] args) {
        EnumsDemo[] values = EnumsDemo.values();
        for(EnumsDemo enumsDemo:values){
            System.out.println(enumsDemo.ordinal()+","+enumsDemo.toString()+","+enumsDemo.getAbbr());
        }

        System.out.println(EnumsDemo.SMALL.compareTo(EnumsDemo.MEDIUM));
    }
}
