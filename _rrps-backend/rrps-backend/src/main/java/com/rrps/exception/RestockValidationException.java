package com.rrps.exception;

public class RestockValidationException extends RuntimeException {

    public RestockValidationException(String message) {
        super(message);
    }
}