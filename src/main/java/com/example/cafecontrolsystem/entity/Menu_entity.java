package com.example.cafecontrolsystem.entity;

import com.example.cafecontrolsystem.dto.UpdateMenuDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties("menus")
    private MenuCategory_entity category;
    
    @Column(length = 500)
    private String description;

    @Column
    private boolean available = true;

    // 더티체킹
    public void changeMenu(UpdateMenuDto updateMenuDto){
        this.price = updateMenuDto.getPrice();
        this.description = updateMenuDto.getDescription();
    }

    // 더티체킹
    public void changeAvailable(){
        this.available = !this.available;
    }
} 