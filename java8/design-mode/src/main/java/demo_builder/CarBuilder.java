package demo_builder;

import java.util.ArrayList;

/**
 * 抽象的建造者 ,
 * 具体的功能由具体实现类实现
 */
public abstract class CarBuilder {
    abstract void setSequence(ArrayList<String> sequence);
    abstract CarModel getCarModel();
}
