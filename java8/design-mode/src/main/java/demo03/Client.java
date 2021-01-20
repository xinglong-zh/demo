package demo03;

public class Client {
    public static void main(String[] args) {
//        ICar car= new Benz();
        ICar car= new Bmw();
        IDriver driver = new Driver();
        driver.DriverCar(car);
    }
}
