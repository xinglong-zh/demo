package demo_abstractFactory;

public abstract class AbstractYellowHuman implements Human {
    public void getColor(){
        System.out.println("黄色皮肤");
    }
    public void talk(){
        System.out.println(this.getClass()+"在说话");
    }

}
