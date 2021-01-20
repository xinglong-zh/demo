package demo_builder;

public class BenzModel extends CarModel {
    @Override
    void start() {
        System.out.println("奔驰启动了");
    }

    @Override
    void stop() {
        System.out.println("奔驰停止了");
    }

    @Override
    void alarm() {
        System.out.println("奔驰响铃了");
    }
}
