package com.demo.thread;

import java.util.ArrayList;
import java.util.concurrent.*;

public class RunableDemo implements Runnable{
    @Override
    public void run() {
        System.out.println("线程开始执行"+Thread.currentThread().getName());
    }

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        Runnable runnable = new RunableDemo();
        Thread t = new Thread(runnable);
        t.start();

//        callable 可以返回计算的结果
//        futureTask 可以进行包装
        Callable<Integer> callable =  new Call();
        FutureTask<Integer> task = new FutureTask(callable);
        Thread thread = new Thread(task);
        thread.start();
        System.out.println(task.get());  //get 阻塞方法

        FutureTask task1 = new FutureTask(()->{ return 88+88;});
        Thread thread1 = new Thread(task1);
        thread1.start();
        System.out.println(task1.get()+","+task1.isDone());


        ExecutorService pool1 = Executors.newCachedThreadPool();  //60秒消亡的线程池
        ExecutorService pool = Executors.newFixedThreadPool(8);  // 固定大小的线程池
        ScheduledExecutorService pool2 = Executors.newScheduledThreadPool(8);  // 延迟执行的线程
        pool.submit(()->{
            System.out.println("hello from pool"+Thread.currentThread().getName());
        });

        pool2.schedule(()->{
            System.out.println("延迟执行的线程"+Thread.currentThread().getName());
        },1000,TimeUnit.MILLISECONDS);

        pool2.scheduleAtFixedRate(()->{
            System.out.println(Thread.currentThread().getName());
        },1000,3,TimeUnit.MILLISECONDS);





    }
}


