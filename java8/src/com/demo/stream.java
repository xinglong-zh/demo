package com.demo;

import java.io.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;


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

//        BufferedReader bufferedReader = new BufferedReader(new FileReader(new File("src/com/demo/20200201060000.000.NOM")));
//        StringBuilder  stringBuilder = new StringBuilder();
//        String str = null;
//        while ((str=bufferedReader.readLine())!=null){
//            stringBuilder.append(str);
//        }
//        bufferedReader.close();
//        System.out.println(stringBuilder);

        String s = "zhangxinglong";

        boolean b = s.startsWith("x", 5);
        System.out.println(b);

        ExecutorService pool = Executors.newCachedThreadPool();




    }


    //  倾向相关公式
    public static Double  AC(Double[][] F,Double[][] O,Double[][]C){
        Double sum = 0D;
        int len = Math.min(F.length,Math.min(O.length,C.length));
        int lenInner = Math.min(F[0].length,Math.min(O[0].length,C[0].length));

        for(int i=0;i<len;i++){
            for (int j=0;j<lenInner;j++){
                sum += (F[i][j] - C[i][j])/(O[i][j]-C[i][j]);
            }
        }
        return sum/variance(F,C)/variance(O,C);
    }

    // 均方差公式
    public static Double meanVariance(Double[][] F,Double[][] O){
        double sum = 0D;
        int len = Math.min(F.length,O.length);  // 取小的作为外层遍历的长度
        int lenInner = Math.min(F[0].length,O[0].length);  // 取小的作为内存遍历的长度
        for (int i = 0; i <len ; i++) {
            for (int j=0;j<lenInner;j++){
                sum+= Math.pow(F[i][j]-O[i][j],2);  // 平方和
            }
        }
        return Math.sqrt(sum/len/lenInner);
    }
    // 方差公式
    public static Double variance(Double[][] F,Double[][] O){
        Double sum = 0D;
        int len = Math.min(F.length,O.length);  // 取小的作为外层遍历的长度
        int lenInner = Math.min(F[0].length,O[0].length);  // 取小的作为内存遍历的长度
        for (int i = 0; i <len ; i++) {
            for (int j=0;j<lenInner;j++){
                sum+= Math.pow(F[i][j]-O[i][j],2);  // 平方和
            }
        }
        return Math.sqrt(sum);
    }
}
