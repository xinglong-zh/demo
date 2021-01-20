package demo_singleton;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * 使用静态内部类 , 保证线程安全
 */
public class SingletonM {

    private SingletonM(){
        System.out.println(Thread.currentThread().getName()+"访问构造函数");
    }

    private static class SingletonHolder{
        private static final SingletonM instance = new SingletonM();
    }

    public static SingletonM getInstance() {
        return SingletonHolder.instance;
    }

    public static void main(String[] args) {
        ExecutorService service = new ThreadPoolExecutor(8,16,0L, TimeUnit.MILLISECONDS,new ArrayBlockingQueue<Runnable>(1024));
        for (int i=0;i<1000;i++){
//            service.submit(()->SingletonM.getInstance());
            service.submit(()->SingleEnum.INSTANCE);
        }
    }
}
