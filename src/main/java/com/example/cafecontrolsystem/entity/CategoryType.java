package com.example.cafecontrolsystem.entity;

public enum CategoryType {
    COFFEE("커피"),
    DECAF("디카페인"),
    NON_COFFEE("논커피/과일라떼"),
    TEA("차"),
    SMOOTHIE("스무디/프라페"),
    ADE("에이드/주스"),
    SEASON("시즌메뉴"),
    BREAD("빵류");

    private final String displayName;

    CategoryType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 