package com.example.cafecontrolsystem.service;


import com.example.cafecontrolsystem.entity.CategoryType;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MenuType {

    ICED_AMERICANO(1800,CategoryType.COFFEE),

    ICED_LATTE(2500,CategoryType.COFFEE),

    ICED_TEA(2500,CategoryType.TEA);

    private final Integer price;
    private final CategoryType categoryType;
}
