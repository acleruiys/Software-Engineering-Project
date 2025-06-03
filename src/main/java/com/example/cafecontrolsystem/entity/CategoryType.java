package com.example.cafecontrolsystem.entity;

public enum CategoryType {
    COFFEE("커피"),
    DECAF("디카페인"),
    NON_COFFEE("논커피/과일라떼"),
    TEA("차"),
    SMOOTHIE("스무디/프라페"),
    ADE("에이드/주스"),
    SEASON("시즌메뉴"),
    BREAD("빵류"),
    DESSERT("디저트"),
    SANDWICH("샌드위치"),
    MD("MD상품"),
    SET("세트메뉴"),
    CAKE("케이크"),
    ETC("기타");

    private final String displayName;

    CategoryType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static CategoryType fromDisplayName(String displayName) {
        for (CategoryType type : CategoryType.values()) {
            if (type.getDisplayName().equals(displayName)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid category display name: " + displayName);
    }
} 