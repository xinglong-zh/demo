package demo_singleton;

/**
 * 使用枚举值 , 保证线程安全
 */
public enum SingleEnum {
    INSTANCE;
    private SingleEnum(){
        System.out.println(Thread.currentThread().getName()+"访问构造函数");
    }
}
