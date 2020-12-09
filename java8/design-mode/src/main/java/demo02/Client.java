package demo02;


public class Client {
    public static void main(String[] args) {
        HandGun handGun = new HandGun();
        Rifle rifle = new Rifle();
        Soldier soldier = new Soldier();
        soldier.setGun(rifle);
        soldier.killEnemy();
    }
}
