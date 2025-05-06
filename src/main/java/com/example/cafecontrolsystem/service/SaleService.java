package com.example.cafecontrolsystem.service;

import com.example.cafecontrolsystem.dto.SaleItemDto;
import com.example.cafecontrolsystem.dto.SalePaymentDto;
import com.example.cafecontrolsystem.dto.SaveSaleDto;
import com.example.cafecontrolsystem.entity.*;
import com.example.cafecontrolsystem.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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


        for(SaleItemDto saleItemDto : saveSaleDto.getMenus()){
            detailRepository.save(SaleDetail.builder()
                    .sale(sale)
                    .menu(menuRepository.findById(saleItemDto.getMenuId())
                            .orElseThrow(() -> new IllegalArgumentException("Error: 미등록 메뉴 " + saleItemDto.getMenuId())))
                    .price(saleItemDto.getPrice())
                    .quantity(saleItemDto.getQuantity())
                    .option(
                            saleItemDto.getOptionId() == null ? null :
                            optionRepository.findById(saleItemDto.getOptionId())
                            .orElseThrow(() -> new IllegalArgumentException("Error: 미등록 옵션 " + saleItemDto.getOptionId()))
                    )
                    .build());
        }

        for(SalePaymentDto salePaymentDto : saveSaleDto.getPayments()){
            PaymentMethod method = methodRepository.findById(salePaymentDto.getPaymentId())
                    .orElseThrow(() -> new IllegalArgumentException("Error: 미등록 결제방법 " + salePaymentDto.getPaymentId()));
            paymentRepository.save(Payment.builder()
                    .sale(sale)
                    .method(method)
                    .price(salePaymentDto.getPrice())
                    .build());

            if(method.getName().equals("POINT")){
                pointRepository.save(PointHistory.builder()
                        .member(memberRepository.findById(saveSaleDto.getMemberId())
                                .orElseThrow(() -> new IllegalArgumentException("Error: 미등록 회원 " + saveSaleDto.getMemberId())))
                        .sale(sale)
                        .amount(salePaymentDto.getPrice())
                        .type("reward")
                        .build());
            }

        }
    }

}
