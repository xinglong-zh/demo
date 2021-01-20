package demo_singleton;

/**
 * 单例模式 , 饿汉模式 , 访问的时候 ,立刻创建一个对象
 */
public class Singleton {
    private static final Singleton singleton = new Singleton();

    /**
     * 私有化构造方法
     */
    private Singleton() {

    }

    /**
     * 提供一个静态方法
     * @return 返回一个实例
     */
    public static Singleton getInstance() {
        return singleton;
    }
}
