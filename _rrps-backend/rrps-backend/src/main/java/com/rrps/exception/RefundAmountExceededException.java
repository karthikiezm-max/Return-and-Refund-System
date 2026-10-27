package com.rrps.exception;

public class RefundAmountExceededException extends RuntimeException {

    public RefundAmountExceededException(String message) {
        super(message);
    }
}