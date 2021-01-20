package demo_builder;

import java.util.ArrayList;

public class BMWBuilder extends CarBuilder {
    private CarModel carModel = new BMWModel();
    @Override
    public void setSequence(ArrayList<String> sequence) {
        this.carModel.setSequence(sequence);
    }

    @Override
    public CarModel getCarModel() {
        return this.carModel;
    }
}
