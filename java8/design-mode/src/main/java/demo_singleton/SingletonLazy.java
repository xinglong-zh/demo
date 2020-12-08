package demo_singleton;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * 懒汉 单例模式 , 可能出现线程安全问题
 */
public class SingletonLazy {
    private static SingletonLazy singletonLazy = null;

    private SingletonLazy() {
        System.out.println(Thread.currentThread().getName() + "线程调用了构造函数");
    }

    public static SingletonLazy getInstance() {
        if (singletonLazy == null) {
            singletonLazy = new SingletonLazy();
        }
        return singletonLazy;
    }

    public static void main(String[] args) {
        ExecutorService service = Executors.newFixedThreadPool(8);
        for (int i=0;i<10;i++){
            service.submit(()-> System.out.println(SingletonLazy.getInstance().hashCode()));
        }
    }
}
