package com.rrps.exception;

public class ExchangeLimitException extends RuntimeException {

    public ExchangeLimitException(String message) {
        super(message);
    }
}