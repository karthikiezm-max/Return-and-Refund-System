package com.rrps.exception;

public class RefundValidationException extends RuntimeException {

    public RefundValidationException(String message) {
        super(message);
    }
}