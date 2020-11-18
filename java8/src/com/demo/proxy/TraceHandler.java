package com.demo.proxy;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

/**
 *
 */
public class TraceHandler implements InvocationHandler {
    private Object target;
    public TraceHandler(Object target) {
        this.target = target;
    }
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
//        return null;
        return method.invoke(target,args);
    }
}
