package com.demo.enums;

import java.util.Comparator;

public enum  EnumsDemo  {
//    SMALL , MEDIUM , LARGE, EXTRA_LARGE

    SMALL("S") , MEDIUM("M") , LARGE("L"), EXTRA_LARGE("XL");

    private String abbr;

    private EnumsDemo(String abbr){
        this.abbr = abbr;
    }

    public String getAbbr(){
        return  this.abbr;
    }

}
