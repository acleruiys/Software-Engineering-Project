package com.example.cafecontrolsystem.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OptionType {
    ADD_ONE_SHOT(500),
    REMOVE_ONE_SHOT(0),
    ADD_ICE(0);

    private final Integer price;
}
