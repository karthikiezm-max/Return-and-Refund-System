package com.rrps.service;

import com.rrps.entity.ReturnRequest;
import com.rrps.enums.ReturnStatus;
import com.rrps.repository.ReturnRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReturnWorkflowService {

    private final ReturnRequestRepository returnRequestRepository;

    public ReturnRequest getReturn(UUID returnId) {

        return returnRequestRepository.findById(returnId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Return request not found: " + returnId
                        ));
    }

    @Transactional
    public ReturnRequest updateStatus(
            UUID returnId,
            ReturnStatus status
    ) {

        if (status == null) {
            throw new RuntimeException(
                    "Return status is required"
            );
        }

        ReturnRequest returnRequest = getReturn(returnId);

        validateStatusChange(
                returnRequest.getStatus(),
                status
        );

        returnRequest.setStatus(status);

        return returnRequestRepository.save(returnRequest);
    }

    private void validateStatusChange(
            ReturnStatus currentStatus,
            ReturnStatus newStatus
    ) {
        if (currentStatus == ReturnStatus.REFUNDED || currentStatus == ReturnStatus.CLOSED || currentStatus == ReturnStatus.CANCELLED) {
            throw new RuntimeException("A " + currentStatus + " return cannot move to another status");
        }

        switch (newStatus) {
            case PICKUP_SCHEDULED:
                if (currentStatus != ReturnStatus.INITIATED && currentStatus != ReturnStatus.PICKUP_SCHEDULED) {
                    throw new RuntimeException("Cannot schedule pickup from status: " + currentStatus);
                }
                break;
            case RECEIVED:
                if (currentStatus != ReturnStatus.PICKUP_SCHEDULED && currentStatus != ReturnStatus.IN_TRANSIT && currentStatus != ReturnStatus.INITIATED) {
                    throw new RuntimeException("Cannot receive item from status: " + currentStatus);
                }
                break;
            case QC_DONE:
                if (currentStatus != ReturnStatus.RECEIVED && currentStatus != ReturnStatus.PICKUP_SCHEDULED && currentStatus != ReturnStatus.IN_TRANSIT && currentStatus != ReturnStatus.INITIATED) {
                    throw new RuntimeException("Cannot complete QC from status: " + currentStatus);
                }
                break;
            case REFUND_INITIATED:
            case EXCHANGE_DISPATCHED:
                if (currentStatus != ReturnStatus.QC_DONE && currentStatus != ReturnStatus.RECEIVED && currentStatus != ReturnStatus.PICKUP_SCHEDULED) {
                    throw new RuntimeException("Cannot initiate resolution from status: " + currentStatus);
                }
                break;
            default:
                break;
        }
    }
}