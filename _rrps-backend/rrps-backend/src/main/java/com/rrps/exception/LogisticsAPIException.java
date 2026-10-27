package com.rrps.exception;

public class LogisticsAPIException extends RuntimeException {

    public LogisticsAPIException(String message) {
        super(message);
    }

    public LogisticsAPIException(String message, Throwable cause) {
        super(message, cause);
    }
}