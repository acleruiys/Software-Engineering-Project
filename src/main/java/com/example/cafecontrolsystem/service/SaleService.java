package com.example.cafecontrolsystem.service;

import com.example.cafecontrolsystem.dto.SaleItemDto;
import com.example.cafecontrolsystem.dto.SalePaymentDto;
import com.example.cafecontrolsystem.dto.SaveSaleDto;
import com.example.cafecontrolsystem.entity.*;
import com.example.cafecontrolsystem.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepository;
    private final SaleDetailRepository detailRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentMethodRepository methodRepository;
    private final MenuRepository menuRepository;
    private final OptionRepository optionRepository;
    private final PointHistoryRepository pointRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public void saveSale(SaveSaleDto saveSaleDto){
        Sale sale = saleRepository.save(Sale.builder()
                .state("ACTIVE")
                .totalPrice(saveSaleDto.getTotalPrice())
                .build());

        saveSaleDto.getMenus()
                .forEach(saleItemDto ->
                    detailRepository.save(SaleDetail.builder()
                            .sale(sale)
                            .menu(menuRepository.findById(saleItemDto.getMenuId())
                                    .orElseThrow(() -> new IllegalArgumentException("Error: 미등록 메뉴 " + saleItemDto.getMenuId())))
                            .price(saleItemDto.getPrice())
                            .quantity(saleItemDto.getQuantity())
                            .option(saleItemDto.getOptionId().stream()
                                    .map(id -> optionRepository.findNameById(id).orElseThrow(() -> new IllegalArgumentException("Error: 미등록 옵션 " + id)))
                                    .collect(Collectors.joining(" ")))
                            .build()));

        saveSaleDto.getPayments()
                .forEach(salePaymentDto -> {
                    paymentRepository.save(Payment.builder()
                        .sale(sale)
                        .method(salePaymentDto.getPayment())
                        .price(salePaymentDto.getPrice())
                        .build());


                    if(salePaymentDto.getPayment().equals("POINT")){
                        Optional.ofNullable(saveSaleDto.getMemberId())
                                .orElseThrow(() -> new IllegalArgumentException("MemberId must not be null"));

                        pointRepository.save(PointHistory.builder()
                                .member(memberRepository.findById(saveSaleDto.getMemberId())
                                        .orElseThrow(() -> new IllegalArgumentException("Error: 미등록 회원 " + saveSaleDto.getMemberId())))
                                .sale(sale)
                                .amount(salePaymentDto.getPrice())
                                .type("reward")
                                .build());

                        memberRepository.findById(saveSaleDto.getMemberId())
                                .orElseThrow(() -> new IllegalArgumentException("Error: 미등록 회원 " + saveSaleDto.getMemberId()))
                                .accumulatePoint(salePaymentDto.getPrice());
                    }
                });
    }
}
