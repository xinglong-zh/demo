package demo02;

/**
 * 士兵, 使用枪杀敌
 */
public class Soldier {
    private AbstractGun gun;

    public void setGun(AbstractGun abstractGun) {
        this.gun = abstractGun;
    }

    public Soldier(){

    }
    public Soldier(AbstractGun gun){
        this.gun = gun;
    }

    /**
     * 杀死敌人
     */
    public void killEnemy() {
        gun.shoot();
    }
}
