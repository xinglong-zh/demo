package com.example.spring.pojo;

import lombok.Data;
import org.springframework.validation.annotation.Validated;

/**
 * @author Administrator
 */
@Validated
@Data
public class Cat implements Animal{
   private String name;
   private String color;

//   public Cat(){
//      System.out.println("cat 无参方法被调用");
//   }

   public Cat(String name,String color){
      this.name = name;
      this.color = color;
      System.out.println("cat name , color 被访问");
   }

   @Override
   public void eat() {
      System.out.printf("%s,%s,在吃",this.color,this.name);
   }
}
