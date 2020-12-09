package demo_abstractFactory;

public abstract class AbstractWhiteHuman implements Human {
    public void getColor(){
        System.out.println("白色皮肤");
    }
    public void talk(){
        System.out.println(this.getClass()+"在说话");
    }
}
