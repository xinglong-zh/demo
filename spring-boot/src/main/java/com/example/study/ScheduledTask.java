package com.example.study;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 定时任务
 *
 */
@Slf4j
@Component
@EnableScheduling  // 开启定时任务
public class ScheduledTask {
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

    @Scheduled(fixedRate = 5000L)
    public void  reportCurrentTime(){
        log.info("time is ,{}",dateFormat.format(new Date()));
    }
}
