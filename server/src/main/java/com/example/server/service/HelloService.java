package com.example.server.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@FeignClient(value = "prefix-provider",fallback = HelloServiceFallback.class )
public interface HelloService {
    @RequestMapping(value = "/hello-provider/{name}",method = RequestMethod.GET)
    String hello(@PathVariable String name);

}
