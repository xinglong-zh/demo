package com.example.spring.service;

import com.sun.org.apache.bcel.internal.generic.ACONST_NULL;
import org.springframework.beans.factory.support.ScopeNotActiveException;

import java.util.*;
import java.util.logging.Handler;

/**
 * @author xinglong
 */
public class Solution {
    public static boolean hasCycle(ListNode head) {
        if (head==null||head.next==null){
            return false;

        }//        利用快慢指针 , 快指针,会遇到慢指针
        ListNode slow = head;
        ListNode fast = head.next;
        while (slow!=fast){
            if (fast==null||fast.next==null){
                // 链表尾部
                return false;
            }
            slow = slow.next; // 慢指针 ,移动一次
            fast = fast.next.next; // 快指针 ,移动两次
        }
        // 指针相遇的时候 , 就是true
        return true;
    }


    public static void main(String[] args) {
        ListNode prevHead;
//        3,2,0,-4
        ListNode listNode = new ListNode(3,new ListNode(2,new ListNode(0,new ListNode(-4))));
        prevHead = listNode;

        while (listNode.next!=null){
            listNode = listNode.next;
        }
        // list 在最后一个
        listNode.next = prevHead.next;
        // 已经成环

        System.out.println(hasCycle(prevHead));


    }
}
