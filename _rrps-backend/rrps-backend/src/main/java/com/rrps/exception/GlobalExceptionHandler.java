package com.rrps.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ReturnWindowClosedException.class)
    public ResponseEntity<Map<String, Object>> handleReturnWindowClosed(
            ReturnWindowClosedException ex
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    @ExceptionHandler(NonReturnableItemException.class)
    public ResponseEntity<Map<String, Object>> handleNonReturnableItem(
            NonReturnableItemException ex
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    @ExceptionHandler(DuplicateReturnException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateReturn(
            DuplicateReturnException ex
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    @ExceptionHandler(QCNotCompletedException.class)
    public ResponseEntity<Map<String, Object>> handleQCNotCompleted(
            QCNotCompletedException ex
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    @ExceptionHandler(RefundAmountExceededException.class)
    public ResponseEntity<Map<String, Object>> handleRefundAmount(
            RefundAmountExceededException ex
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    @ExceptionHandler(FraudHoldException.class)
    public ResponseEntity<Map<String, Object>> handleFraudHold(
            FraudHoldException ex
    ) {
        return buildResponse(
                HttpStatus.FORBIDDEN,
                ex.getMessage()
        );
    }

    @ExceptionHandler(SupportOverrideException.class)
    public ResponseEntity<Map<String, Object>> handleSupportOverride(
            SupportOverrideException ex
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    @ExceptionHandler(ExchangeLimitException.class)
    public ResponseEntity<Map<String, Object>> handleExchangeLimit(
            ExchangeLimitException ex
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    @ExceptionHandler(ExchangeValidationException.class)
    public ResponseEntity<Map<String, Object>> handleExchangeValidation(
            ExchangeValidationException ex
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    @ExceptionHandler(LogisticsAPIException.class)
    public ResponseEntity<Map<String, Object>> handleLogistics(
            LogisticsAPIException ex
    ) {
        return buildResponse(
                HttpStatus.BAD_GATEWAY,
                ex.getMessage()
        );
    }

    @ExceptionHandler(RestockValidationException.class)
    public ResponseEntity<Map<String, Object>> handleRestockValidation(
            RestockValidationException ex
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    @ExceptionHandler(LiquidationValidationException.class)
    public ResponseEntity<Map<String, Object>> handleLiquidationValidation(
            LiquidationValidationException ex
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    @ExceptionHandler(RtmValidationException.class)
    public ResponseEntity<Map<String, Object>> handleRtmValidation(
            RtmValidationException ex
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    @ExceptionHandler(PickupValidationException.class)
    public ResponseEntity<Map<String, Object>> handlePickupValidation(
            PickupValidationException ex
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    @ExceptionHandler(QCValidationException.class)
    public ResponseEntity<Map<String, Object>> handleQCValidation(
            QCValidationException ex
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    @ExceptionHandler(RefundValidationException.class)
    public ResponseEntity<Map<String, Object>> handleRefundValidation(
            RefundValidationException ex
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException ex
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(
            Exception ex
    ) {
        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                ex.getMessage()
        );
    }

    private ResponseEntity<Map<String, Object>> buildResponse(
            HttpStatus status,
            String message
    ) {

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("timestamp", LocalDateTime.now());
        response.put("status", status.value());
        response.put("error", status.getReasonPhrase());
        response.put("message", message);

        return ResponseEntity
                .status(status)
                .body(response);
    }
}