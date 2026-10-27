package com.rrps.exception;

public class NonReturnableItemException extends RuntimeException {

    public NonReturnableItemException(String message) {
        super(message);
    }
}