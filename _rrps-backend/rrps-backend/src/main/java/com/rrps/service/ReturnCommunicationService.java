package com.rrps.service;

import com.rrps.dto.ReturnCommunicationRequest;
import com.rrps.entity.ReturnCommunication;
import com.rrps.entity.ReturnRequest;
import com.rrps.enums.CommunicationStatus;
import com.rrps.repository.ReturnCommunicationRepository;
import com.rrps.repository.ReturnRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ReturnCommunicationService {

    private final ReturnCommunicationRepository communicationRepository;
    private final ReturnRequestRepository returnRequestRepository;

    public ReturnCommunicationService(
            ReturnCommunicationRepository communicationRepository,
            ReturnRequestRepository returnRequestRepository
    ) {
        this.communicationRepository = communicationRepository;
        this.returnRequestRepository = returnRequestRepository;
    }

    @Transactional
    public ReturnCommunication create(
            ReturnCommunicationRequest request
    ) {

        if (request == null) {
            throw new RuntimeException(
                    "Communication request is required"
            );
        }

        if (request.getReturnId() == null) {
            throw new RuntimeException(
                    "Return ID is required"
            );
        }

        if (request.getEventType() == null ||
                request.getEventType().isBlank()) {

            throw new RuntimeException(
                    "Event type is required"
            );
        }

        if (request.getChannel() == null) {
            throw new RuntimeException(
                    "Communication channel is required"
            );
        }

        ReturnRequest returnRequest =
                returnRequestRepository.findById(
                        request.getReturnId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Return request not found"
                        )
                );

        ReturnCommunication communication =
                new ReturnCommunication();

        communication.setReturnRequest(returnRequest);
        communication.setEventType(
                request.getEventType()
        );
        communication.setChannel(
                request.getChannel()
        );
        communication.setSentAt(
                LocalDateTime.now()
        );

        communication.setStatus(
                request.getStatus() == null
                        ? CommunicationStatus.SENT
                        : request.getStatus()
        );

        return communicationRepository.save(
                communication
        );
    }

    public List<ReturnCommunication> getAll() {
        return communicationRepository.findAll();
    }

    public ReturnCommunication getById(UUID id) {

        return communicationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Communication not found"
                        )
                );
    }

    public List<ReturnCommunication> getByReturnId(
            UUID returnId
    ) {
        return communicationRepository
                .findByReturnRequestReturnId(returnId);
    }

    // Compatibility method used by CommunicationController
    public List<ReturnCommunication> getByReturn(
            UUID returnId
    ) {
        return getByReturnId(returnId);
    }

    public List<ReturnCommunication> getByStatus(
            CommunicationStatus status
    ) {

        return communicationRepository
                .findByStatus(status);
    }

    @Transactional
    public ReturnCommunication updateStatus(
            UUID id,
            CommunicationStatus status
    ) {

        if (status == null) {
            throw new RuntimeException(
                    "Communication status is required"
            );
        }

        ReturnCommunication communication =
                getById(id);

        communication.setStatus(status);

        return communicationRepository.save(
                communication
        );
    }

    @Transactional
    public ReturnCommunication update(
            UUID id,
            ReturnCommunicationRequest request
    ) {

        if (request == null) {
            throw new RuntimeException(
                    "Communication request is required"
            );
        }

        ReturnCommunication communication =
                getById(id);

        if (request.getEventType() != null &&
                !request.getEventType().isBlank()) {

            communication.setEventType(
                    request.getEventType()
            );
        }

        if (request.getChannel() != null) {
            communication.setChannel(
                    request.getChannel()
            );
        }

        if (request.getStatus() != null) {
            communication.setStatus(
                    request.getStatus()
            );
        }

        return communicationRepository.save(
                communication
        );
    }

    @Transactional
    public void delete(UUID id) {

        if (!communicationRepository.existsById(id)) {
            throw new RuntimeException(
                    "Communication not found"
            );
        }

        communicationRepository.deleteById(id);
    }
}