package com.example.cafecontrolsystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "menu_option")
@Getter @Setter
public class MenuOption {
    @Id
    @Column(name = "option_code")
    private Long optionCode;
    
    private String name;
    
    private String available;
    
    private String price;
} 