package demo_factory;

public class WhiteHuman implements Human {
    @Override
    public void getColor() {
        System.out.println("白色皮肤");
    }

    @Override
    public void talk() {
        System.out.println(this.getClass()+"在说话");
    }
}
