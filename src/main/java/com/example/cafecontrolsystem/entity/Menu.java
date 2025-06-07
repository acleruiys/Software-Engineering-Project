package com.example.cafecontrolsystem.entity;

import com.example.cafecontrolsystem.dto.UpdateMenuDto;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Entity
@Table(name = "menus", indexes = @Index(name = "idx_id_name_category", columnList = "id, name, category"))
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Menu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false)
    private String category;

    @Column
    private boolean available = true;

    // 더티체킹
    public void changeMenu(UpdateMenuDto updateMenuDto){
        this.price = updateMenuDto.getPrice();

    }

    // 더티체킹
    public void changeAvailable(){
        this.available = !this.available;
    }
}