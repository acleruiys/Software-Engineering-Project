package com.example.cafecontrolsystem.dto;

import lombok.Getter;

@Getter
public class UpdateMemberDto {
    private String name;

    private String beforePhone;

    private String afterPhone;

    private String password;  // 4자리 비밀번호

}
