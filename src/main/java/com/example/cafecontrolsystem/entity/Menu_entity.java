package com.example.cafecontrolsystem.entity;

import com.example.cafecontrolsystem.dto.UpdateMenuDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Entity
@Table(name = "menus")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Menu_entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
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