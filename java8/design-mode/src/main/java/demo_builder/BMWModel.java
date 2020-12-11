package demo_builder;

public class BMWModel extends CarModel {
    @Override
    void start() {
        System.out.println("宝马启动了");
    }

    @Override
    void stop() {
        System.out.println("宝马停止了");

    }

    @Override
    void alarm() {
        System.out.println("宝马响铃了");

    }
}
