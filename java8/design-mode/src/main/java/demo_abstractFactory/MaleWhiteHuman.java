package demo_abstractFactory;

public class MaleWhiteHuman extends AbstractWhiteHuman{
    @Override
    public void getSex() {
        System.out.println("男性");
    }
}
