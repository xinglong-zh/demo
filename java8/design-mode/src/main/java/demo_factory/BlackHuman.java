package demo_factory;

public class BlackHuman implements Human {
    @Override
    public void getColor() {
        System.out.println("黑色皮肤");
    }

    @Override
    public void talk() {
        System.out.println(this.getClass()+"在说话");
    }
}
