package demo03;

public class Driver implements IDriver{
    public void DriverCar(ICar car){
        System.out.println("驾驶员在开车");
        car.run();
    }
}
