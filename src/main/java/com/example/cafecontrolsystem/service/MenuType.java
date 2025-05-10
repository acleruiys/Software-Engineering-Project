package com.example.cafecontrolsystem.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MenuType {
    ICED_AMERICANO(1800, 1L),
    ICED_LATTE(2500, 1L),
    ICED_TEA(2500, 4L);

    private final Integer price;
    private final Long category_id;
}