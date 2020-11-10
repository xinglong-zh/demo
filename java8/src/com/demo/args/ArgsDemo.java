package com.demo.args;

import java.io.PrintStream;

public class ArgsDemo {
    public static void main(String[] args) {
        System.out.printf("string:%s,int %f","string",12f);  // printf 格式化 ,沿用的是c语言的模式 , 和python用的是一个逻辑 , %占位符  s 字符 ,f 单精度 d整数
        System.out.println();
          // 可变参数
//        public PrintStream printf(String format, Object ... args) {
//            return format(format, args);
//        }

        int res = sum(1,2,3,3,3,3);
        System.out.println(res);

        int res1 = max(2,4,5,6,6,6,6,7);
        System.out.println(res1);
    }


    public static int sum(int ...arr){
        int sum = 0;
        for (int i:arr){
            sum+=i;
        }
        return sum;
    }
    public static int max(int a,int b,int ...values){
      int res =a;
      if(b>a){
          res=b;
      }
      for(int i:values){
          if(i>res){
              res = i;
          }
      }

      return  res;
    };
}
