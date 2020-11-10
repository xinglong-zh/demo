package com.demo.abs;

/**
 * 修饰符 ,
 * public  --  所有类可见      ,  用于方法
 * private --  本类可见        ,  数据封装  oop
 * protected -- 本包以及子类    ,  不常用
 * 默认     -- 不需要修饰符 ,包可见
 */
public class DemoAbs {
    public static void main(String[] args) throws IllegalAccessException, InstantiationException {
        Person p = new Student("xiaoli",30);
        System.out.println(p.toString());
        Person person = p.getClass().newInstance();
        System.out.println(person.toString());
    }
}


