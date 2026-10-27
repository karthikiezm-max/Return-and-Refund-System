package com.rrps.exception;

public class QCNotCompletedException extends RuntimeException {

    public QCNotCompletedException(String message) {
        super(message);
    }
}