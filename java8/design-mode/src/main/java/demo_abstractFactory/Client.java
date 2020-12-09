package demo_abstractFactory;

import demo_factory.AbstractHumanFactory;

/**
 * Provide an interface for creating families of related or dependent objects without specifyingtheir concrete classes.（为创建一组相关或相互依赖的对象提供一个接口，而且无须指定它们的具体类。）
 * 创建产品足使用 , 左右对称 , 男性女性  ,
 */
public class Client {
    public static void main(String[] args) {
//       第一条生成线 , 女性生产线
        HumanFactory femaleFactory = new FemaleFactory();
        femaleFactory.createYellowHuman().getColor();
        femaleFactory.createWhiteHuman().getColor();
//        第二条生成线, 男性生成线
        MaleFactory maleFactory = new MaleFactory();
        maleFactory.createYellowHuman().getColor();
        maleFactory.createWhiteHuman().getColor();
    }
}
