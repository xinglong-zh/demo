package demo_template;

public class BenzH2Model extends BenzModel {
    @Override
    void start() {
        System.out.println("benz2"+"启动了");
    }

    @Override
    public void stop() {
        System.out.println("benz2"+"停止了");
    }

    @Override
    void alarm() {
        System.out.println("benz2"+"按喇叭了");
    }

    @Override
    boolean isAlarm() {
        return false;
    }
}
