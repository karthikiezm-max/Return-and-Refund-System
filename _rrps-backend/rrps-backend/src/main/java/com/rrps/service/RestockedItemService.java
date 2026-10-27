package com.rrps.service;

import com.rrps.dto.RestockedItemRequest;
import com.rrps.entity.QCInspection;
import com.rrps.entity.RestockedItem;
import com.rrps.entity.SKU;
import com.rrps.enums.Disposition;
import com.rrps.repository.QCInspectionRepository;
import com.rrps.repository.RestockedItemRepository;
import com.rrps.repository.SKURepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class RestockedItemService {

    private final RestockedItemRepository restockedItemRepository;
    private final QCInspectionRepository qcInspectionRepository;
    private final SKURepository skuRepository;
    private final RestockValidator restockValidator;

    public RestockedItemService(
            RestockedItemRepository restockedItemRepository,
            QCInspectionRepository qcInspectionRepository,
            SKURepository skuRepository,
            RestockValidator restockValidator
    ) {
        this.restockedItemRepository = restockedItemRepository;
        this.qcInspectionRepository = qcInspectionRepository;
        this.skuRepository = skuRepository;
        this.restockValidator = restockValidator;
    }

    @Transactional
    public RestockedItem create(
            RestockedItemRequest request
    ) {

        if (request == null) {
            throw new RuntimeException(
                    "Restocked item request is required"
            );
        }

        if (request.getQcId() == null) {
            throw new RuntimeException(
                    "QC ID is required"
            );
        }

        if (request.getSkuId() == null) {
            throw new RuntimeException(
                    "SKU ID is required"
            );
        }

        if (request.getQuantity() == null ||
                request.getQuantity() <= 0) {

            throw new RuntimeException(
                    "Quantity must be greater than zero"
            );
        }

        QCInspection qcInspection =
                qcInspectionRepository.findById(
                        request.getQcId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "QC inspection not found"
                        )
                );

        SKU sku =
                skuRepository.findById(
                        request.getSkuId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "SKU not found"
                        )
                );

        Disposition disposition =
                qcInspection.getDisposition();

        if (disposition != Disposition.RESTOCK_NEW &&
                disposition != Disposition.RESTOCK_REFURB) {

            throw new RuntimeException(
                    "QC disposition does not allow restocking"
            );
        }

        RestockedItem restockedItem =
                new RestockedItem();

        restockedItem.setQcInspection(qcInspection);
        restockedItem.setSku(sku);
        restockedItem.setQuantity(
                request.getQuantity()
        );
        restockedItem.setRestockType(
                request.getRestockType()
        );
        restockedItem.setNewListingPrice(
                request.getNewListingPrice()
        );
        restockedItem.setRestockedAt(
                LocalDateTime.now()
        );

        restockValidator.validate(
                restockedItem
        );

        return restockedItemRepository.save(
                restockedItem
        );
    }

    public List<RestockedItem> getAll() {
        return restockedItemRepository.findAll();
    }

    public RestockedItem getById(UUID id) {

        return restockedItemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Restocked item not found"
                        )
                );
    }

    public List<RestockedItem> getByQcId(
            UUID qcId
    ) {
        return restockedItemRepository
                .findByQcInspectionQcId(qcId);
    }

    public List<RestockedItem> getBySkuId(
            UUID skuId
    ) {
        return restockedItemRepository
                .findBySkuSkuId(skuId);
    }

    @Transactional
    public RestockedItem update(
            UUID id,
            RestockedItemRequest request
    ) {

        if (request == null) {
            throw new RuntimeException(
                    "Restocked item request is required"
            );
        }

        RestockedItem item =
                getById(id);

        if (request.getQuantity() != null) {
            if (request.getQuantity() <= 0) {
                throw new RuntimeException(
                        "Quantity must be greater than zero"
                );
            }

            item.setQuantity(
                    request.getQuantity()
            );
        }

        if (request.getRestockType() != null) {
            item.setRestockType(
                    request.getRestockType()
            );
        }

        if (request.getNewListingPrice() != null) {
            item.setNewListingPrice(
                    request.getNewListingPrice()
            );
        }

        restockValidator.validate(item);

        return restockedItemRepository.save(item);
    }

    @Transactional
    public void delete(UUID id) {

        if (!restockedItemRepository.existsById(id)) {
            throw new RuntimeException(
                    "Restocked item not found"
            );
        }

        restockedItemRepository.deleteById(id);
    }
}