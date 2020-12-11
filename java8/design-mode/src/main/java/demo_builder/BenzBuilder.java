package demo_builder;

import java.util.ArrayList;

public class BenzBuilder extends CarBuilder {
    private CarModel carModel = new BenzModel();

    @Override
    public void setSequence(ArrayList<String> sequence) {
            this.carModel.setSequence(sequence);
    }

    @Override
    public CarModel getCarModel() {
      return  this.carModel;
    }
}
