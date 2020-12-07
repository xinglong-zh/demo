# 设计模式重读
---
## 六大原则
1. Single Responsibility Principle,SRP 单一职责原则
    > 应该有且仅有一个原因引起类的变更. 可以使用在接口,类,方法上 .  开发简单 , 维护改动小.
2. 里式替换原则 所有引用基类的地方都可以透明的使用其子类 , 通俗的说, 父类出现的地方,子类都可以替代, 不会产生异常 , 反之,子类出现的地方, 父类未必能适应. 
    todo:委托模式, 解决玩具枪杀人问题
3. 依赖倒置原则 , 模块间的依赖通过抽象发生 . 接口和抽象类不依赖于实现类,实现类依赖接口和抽象类 .
    >依赖正置就是类间的依赖是实实在在的实现类间的依赖，也就是面向实现编程，这也是正常人的思维方式，我要开奔驰车就依赖奔驰车，我要使用笔记本电脑就直接依赖笔记本电脑，而编写程序需要的是对现实世界的事物进行抽象，抽象的结果就是有了抽象类和接口，然后我们根据系统设计的需要产生了抽象间的依赖，代替了人们传统思维中的事物间的依赖，“倒置”就是从这里产生的。
                                                                                                                                                                         >
    ```java
   //依赖注入的几种方式
   package demo02;
   
   /**
    * setter 和 构造器注入
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

   /** 接口注入 */
   public interface IDriver {
       void DriverCar(ICar car);
   }
   
   
   
   ```
4. 接口隔离原则
5. 迪米特法则
6. 开闭原因
