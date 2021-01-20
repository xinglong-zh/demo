package demo_template;

public class BenzH1Model extends BenzModel {
    @Override
    void start() {
        System.out.println("benz1" + "启动了");
    }

    @Override
    void stop() {
        System.out.println("benz1" + "停止了");
    }

    @Override
    void alarm() {
        System.out.println("benz1" + "按喇叭");
    }

    @Override
    boolean isAlarm() {
        return true;
    }
}
