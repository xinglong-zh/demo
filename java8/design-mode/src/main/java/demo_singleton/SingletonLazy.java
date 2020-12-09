package demo_singleton;

import java.util.concurrent.*;

/**
 * 懒汉 单例模式 , 可能出现线程安全问题
 * 方案2  , 双重锁,
 */
public class SingletonLazy {
    private volatile static SingletonLazy singletonLazy = null;

    private SingletonLazy() {
        System.out.println(Thread.currentThread().getName() + "线程调用了构造函数");
    }

    public static SingletonLazy getInstance() {
        if (singletonLazy == null) {
            synchronized (SingletonLazy.class) {
                if (singletonLazy == null) {
                    singletonLazy = new SingletonLazy();
                }
            }
        }
        return singletonLazy;
    }

    public static void main(String[] args) {
//        ExecutorService service = Executors.newFixedThreadPool(8);
        ExecutorService service = new ThreadPoolExecutor(8, 16, 0L, TimeUnit.MILLISECONDS, new ArrayBlockingQueue<Runnable>(1024));
        for (int i = 0; i < 1000; i++) {
            service.submit(() -> SingletonLazy.getInstance());
        }
    }
}
