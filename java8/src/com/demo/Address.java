package com.demo;

public class Address {
    private String name;
    private Integer score;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Address(String name, Integer score) {
        this.name = name;
        this.score = score;
    }

    public Address() {
    }

    @Override
    public String toString() {
        return "Address{" +
                "name='" + name + '\'' +
                ", score=" + score +
                '}';
    }
}
