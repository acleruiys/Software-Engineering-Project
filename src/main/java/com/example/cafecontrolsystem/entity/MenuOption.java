package com.example.cafecontrolsystem.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.boot.autoconfigure.web.WebProperties;

@Entity
@Table(name = "menu_option")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MenuOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "option_id")
    private Long optionId;
    
    private String name;
    
    private Boolean available;
    
    private Integer price;

    public void changeAvailable(){
        this.available = !this.available;
    }

    public void changeOptionPrice(Integer price){
        this.price = price;
    }
} 