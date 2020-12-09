package demo_abstractFactory;

public class MaleYellowHuman extends AbstractYellowHuman {
    @Override
    public void getSex() {
        System.out.println("男性");
    }
}
