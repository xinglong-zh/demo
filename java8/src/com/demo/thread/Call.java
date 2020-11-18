package com.demo.thread;

import java.util.concurrent.Callable;

public class Call implements Callable<Integer> {
    @Override
    public Integer call() throws Exception {
        return 10+12;
    }
}
