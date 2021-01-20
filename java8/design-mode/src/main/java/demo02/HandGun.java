package demo02;

/**
 * 手枪 , 射程短
 */
public class HandGun extends AbstractGun{

    @Override
    void shoot() {
        System.out.println("手枪射击");
    }
}
