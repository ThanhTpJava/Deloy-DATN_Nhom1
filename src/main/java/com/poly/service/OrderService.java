package com.poly.service;

import java.util.List;


import com.fasterxml.jackson.databind.JsonNode;
import com.poly.entity.Order;

public interface OrderService {


	public Order create(JsonNode orderData) ;
	
	public Order findById(Long id) ;
	
	public List<Order> findByUsername(String username) ;

	public List<Order> findAll();

	public Order EditbyID(Order order);

	public void delete(Long id) ;

	public List<Object[]> deliveredOrdersByMonth();
}
