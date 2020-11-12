package com.demo.reflact;

import javax.swing.text.Style;
import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.lang.reflect.*;

public class ReflectTest {
    public static void main(String[] args) throws ClassNotFoundException, IllegalAccessException, InstantiationException, InvocationTargetException, IntrospectionException {
        String s = Student.class.getName();
        System.out.println(s);

        Class<?> aClass = Class.forName(s);  // 字符串返回class
//        System.out.println(aClass);
        Object o = aClass.newInstance();  // 调用无参构造方法
        System.out.println(o.getClass().getName());

        System.out.println("-------------------");
//        System.out.println(student);

        /**
         * 获取属性 , 和属性值
         */
        Field[] fields = Student.class.getFields();
        for (Field field:fields){
//            System.out.println(field);
            PropertyDescriptor descriptor = new PropertyDescriptor(field.getName(),Student.class);
            Method readMethod = descriptor.getReadMethod();
            Method writeMethod = descriptor.getWriteMethod();

            Object o1 = readMethod.invoke(new Student());  // 调用getter

        }

        Field[] declaredFields = Student.class.getDeclaredFields();
        for (Field field:declaredFields){
            System.out.println(field);
        }
        System.out.println("-------------------");
        Method[] methods = Student.class.getMethods();
        for(Method method:methods){
//            System.out.println(method);
            int modifiers = method.getModifiers();
            boolean b = Modifier.isAbstract(modifiers);
            System.out.println(method+","+b);
        }

        System.out.println("-------------------");
        Constructor<?>[] constructors = Student.class.getConstructors();
        for (Constructor constructor:constructors){
            System.out.println(constructor);
        }

    }
}
