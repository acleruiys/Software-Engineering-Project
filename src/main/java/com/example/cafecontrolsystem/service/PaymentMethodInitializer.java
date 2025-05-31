package com.example.cafecontrolsystem.service;

import com.example.cafecontrolsystem.entity.PaymentMethod;
import com.example.cafecontrolsystem.repository.PaymentMethodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// 초기 결제 방법 세팅
@Component
@RequiredArgsConstructor
public class PaymentMethodInitializer implements CommandLineRunner {

    private final PaymentMethodRepository methodRepository;

    @Override
    public void run(String... args) throws Exception {
        if (methodRepository.count() == 0) {
            initializePayment();
        }
    }

    private void initializePayment() {
        for (PaymentMethodType type : PaymentMethodType.values() ) {
            methodRepository.save(PaymentMethod.builder()
                    .name(type.name())
                    .status(PaymentMethod.PaymentMethodStatus.ACTIVE)
                    .build());
        }
    }

}
