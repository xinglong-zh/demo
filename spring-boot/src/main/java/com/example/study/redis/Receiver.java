package com.example.study.redis;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * redis 接收消息
 * You will use the Redis template to send messages,
 * The connection factory drives both the template and the message listener container, letting them connect to the Redis server.
 */
@Slf4j
@Data
public class Receiver {
    private AtomicInteger counter = new AtomicInteger();
    private final StringRedisTemplate stringRedisTemplate;

    @Autowired
    public Receiver(StringRedisTemplate stringRedisTemplate){
        this.stringRedisTemplate = stringRedisTemplate;
    }
    public void receiverMessage(String message){
        counter.incrementAndGet();
    }


}
