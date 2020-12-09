package demo_factory;

public class Client {
    public static void main(String[] args) {
        AbstractHumanFactory abstractHumanFactory = new HumanFactory();
        Human yellowHuman = abstractHumanFactory.createHuman(YellowHuman.class);
        yellowHuman.talk();
        Human blackHuman = abstractHumanFactory.createHuman(BlackHuman.class);
        blackHuman.talk();
        Human  whiteHuman = abstractHumanFactory.createHuman(WhiteHuman.class);
        whiteHuman.talk();
    }
}
