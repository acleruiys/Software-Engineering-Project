package com.example.cafecontrolsystem.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum MemberType {

    LEE("01012345678"),
    PARK("01011111111"),
    KIM("01022222222"),
    SEO("01033333333"),
    CHOI("01044444444");

    private final String phone;
}
