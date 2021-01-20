package demo_builder;


import java.util.ArrayList;

/**
 * 导演类 , 封装了构造过程 , 返回构造后的对象
 */

public class Director {
    private ArrayList<String> sequence = new ArrayList<>();
    private BenzBuilder benzBuilder = new BenzBuilder();
    public CarModel getABenzModel(){
        this.sequence.clear();
        sequence.add("alarm");
        sequence.add("start");
        sequence.add("stop");
        benzBuilder.setSequence(sequence);
        return benzBuilder.getCarModel();
    }


    public CarModel getBBenzModel(){
        this.sequence.clear();
        sequence.add("start");
        sequence.add("stop");
        benzBuilder.setSequence(sequence);
        return benzBuilder.getCarModel();
    }
}
