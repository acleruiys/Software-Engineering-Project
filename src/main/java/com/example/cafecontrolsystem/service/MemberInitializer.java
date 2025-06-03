package com.example.cafecontrolsystem.service;

import com.example.cafecontrolsystem.entity.CategoryType;
import com.example.cafecontrolsystem.entity.Member;
import com.example.cafecontrolsystem.entity.MenuCategory_entity;
import com.example.cafecontrolsystem.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Order(4)
public class MemberInitializer implements CommandLineRunner {

    private final MemberRepository memberRepository;

    @Override
    public void run(String... args) {
        if (memberRepository.count() == 0) {
            initializeCategories();
        }
    }

    private void initializeCategories() {
        for (MemberType type : MemberType.values()) {
            memberRepository.save(Member.builder()
                    .name(type.name())
                    .phone(type.getPhone())
                    .points(0)
                    .build());
        }
    }
}
