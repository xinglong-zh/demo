package com.example.spring.controller;

import lombok.Data;
import org.springframework.stereotype.Component;

/**
 * @author Administrator
 */
@Data
@Component
public class AccuracyRequest {
    /** 检验元素 LBQ ,FOG ,CLQ */
    private String element;
    /** 开始时间 2020 08 01 年元日 , 字符串 */
    private String startTime;
    /** 结束时间 */
    private String endTime;
    /** 评分 暂时保留  */
    private String scoreItem;
    /** 区域  domain1 , domain2*/
    private String domain;
    /** 时次 00,12 */
    private String period;
}

