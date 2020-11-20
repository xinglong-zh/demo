package com.demo.nerwork;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

public class URLDemo {
    public static void main(String[] args) throws IOException {
        URL url = new URL("https://github.com/alibaba/p3c/blob/master/Java%E5%BC%80%E5%8F%91%E6%89%8B%E5%86%8C%EF%BC%88%E5%B5%A9%E5%B1%B1%E7%89%88%EF%BC%89.pdf");

        URLConnection urlConnection = url.openConnection();

        urlConnection.setDoInput(true);
        urlConnection.setDoOutput(true);
        // 提交到服务器

        urlConnection.setRequestProperty("key","value");
        // 用来设置 header 的键值对

        urlConnection.connect();

        InputStream inputStream =  urlConnection.getInputStream();
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
        String str;
        while ((str=bufferedReader.readLine())!=null){
            System.out.println(str);
        }
        String contentType = urlConnection.getContentType();
        String contentEncoding = urlConnection.getContentEncoding();
        System.out.println(contentType+","+contentEncoding);

    }
}
