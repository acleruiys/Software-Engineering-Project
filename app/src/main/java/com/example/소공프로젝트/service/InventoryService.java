package com.example.소공프로젝트.service;

import com.example.소공프로젝트.Entity.Inventory;
import com.example.소공프로젝트.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public List<Inventory> getAll() {
        return inventoryRepository.findAll();
    }

    public Inventory save(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    public Inventory getById(Long id) {
        return inventoryRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        inventoryRepository.deleteById(id);
    }
}

