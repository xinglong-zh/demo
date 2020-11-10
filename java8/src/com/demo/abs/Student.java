package com.demo.abs;

public class Student implements Person {
    private String name;
    private Integer age;

    public Student() {
    }
    public Student(String name, Integer age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String getName() {

        return this.name;
    }

    @Override
    public Integer getAge() {
        return this.age;
    }

    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
