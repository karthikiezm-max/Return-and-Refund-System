package com.rrps.service;

import com.rrps.entity.ReturnItem;
import com.rrps.repository.ReturnItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ReturnItemService {

    private final ReturnItemRepository returnItemRepository;

    public ReturnItemService(ReturnItemRepository returnItemRepository) {
        this.returnItemRepository = returnItemRepository;
    }

    public List<ReturnItem> getAll() {
        return returnItemRepository.findAll();
    }

    public ReturnItem getById(UUID id) {
        return returnItemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Return item not found with id: " + id
                        )
                );
    }

    public List<ReturnItem> getByReturnId(UUID returnId) {
        return returnItemRepository.findByReturnRequestReturnId(returnId);
    }

    public List<ReturnItem> getBySkuId(UUID skuId) {
        return returnItemRepository.findBySkuSkuId(skuId);
    }

    public ReturnItem create(ReturnItem returnItem) {
        return returnItemRepository.save(returnItem);
    }

    public ReturnItem update(UUID id, ReturnItem returnItem) {

        ReturnItem existing = getById(id);

        existing.setReturnRequest(returnItem.getReturnRequest());
        existing.setOrderItem(returnItem.getOrderItem());
        existing.setSku(returnItem.getSku());
        existing.setQuantity(returnItem.getQuantity());
        existing.setReturnReason(returnItem.getReturnReason());
        existing.setEvidenceUrls(returnItem.getEvidenceUrls());
        existing.setExchangeSku(returnItem.getExchangeSku());

        return returnItemRepository.save(existing);
    }

    public void delete(UUID id) {

        if (!returnItemRepository.existsById(id)) {
            throw new RuntimeException(
                    "Return item not found with id: " + id
            );
        }

        returnItemRepository.deleteById(id);
    }
}