package com.poly.controller.adminControllers;


import com.poly.service.OrderService;
import com.poly.service.OrderStatusService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class OrderAdminController {

    @Autowired
    OrderService orderService;
    
    @Autowired
    OrderStatusService orderStatusService;
    
    @RequestMapping("/admin/orders")
    public String findAll(Model model) {
        model.addAttribute("orders",orderStatusService.findAll());
        return "admin/order";
    }
}
