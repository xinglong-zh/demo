package demo_abstractFactory;

public class FemaleWhiteHuman extends AbstractWhiteHuman{
    @Override
    public void getSex() {
        System.out.println("女性");
    }
}
