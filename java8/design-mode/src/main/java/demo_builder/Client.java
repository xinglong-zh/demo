package demo_builder;

import java.util.ArrayList;
import java.util.List;

/**
 * 建造者模式  , 就是可以指定执行顺序
 * 和模板模式类似
 * Separate the construction of a complex object from its representation so that the sameconstruction process can create different representations.
 * （将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。）
 * 建造类 , 强调执行顺序 ,或者装配不同的零件
 */
public class Client {
    public static void main(String[] args) {
        ArrayList<String> strings = new ArrayList<>();
        /** 首先清理array  */
        strings.clear();
        strings.add("start");
        strings.add("alarm");
        strings.add("stop");
//        CarModel carModel = new BenzModel();
//        carModel.setSequence(strings);
//        carModel.run();
        /** 改进后的建造者模式 , 每个产品类有对应的建造者 */

        BenzBuilder benzBuilder = new BenzBuilder();
        CarModel model = benzBuilder.getCarModel();
        model.setSequence(strings);
        model.run();


        /** 改进 , 增加导演类 , 生成不同型号的车辆 ab benz  */

        Director director = new Director();
        for (int i=0;i<10;i++){
            director.getABenzModel().run();
        }

        System.out.println("------------------------");

        for (int i=0;i<5;i++){
            director.getBBenzModel().run();
        }

    }
}
