package com.rrps.service;

import com.rrps.entity.OrderItem;
import com.rrps.entity.ReturnRequest;
import org.springframework.stereotype.Service;

@Service
public class OrderItemReturnValidator {

    public void validate(
            ReturnRequest returnRequest,
            OrderItem orderItem
    ) {

        if (returnRequest == null) {
            throw new RuntimeException(
                    "Return request is required"
            );
        }

        if (orderItem == null) {
            throw new RuntimeException(
                    "Order item is required"
            );
        }

        if (returnRequest.getOrder() == null ||
                returnRequest.getOrder().getOrderId() == null) {

            throw new RuntimeException(
                    "Return order is required"
            );
        }

        if (orderItem.getOrder() == null ||
                orderItem.getOrder().getOrderId() == null) {

            throw new RuntimeException(
                    "Order item is not associated with an order"
            );
        }

        if (!returnRequest.getOrder()
                .getOrderId()
                .equals(orderItem.getOrder().getOrderId())) {

            throw new RuntimeException(
                    "Order item does not belong to the return order"
            );
        }
    }
}