package com.example.cafecontrolsystem.service;

import com.example.cafecontrolsystem.dto.*;
import com.example.cafecontrolsystem.entity.*;
import com.example.cafecontrolsystem.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepository;
    private final SaleDetailRepository detailRepository;
    private final PaymentRepository paymentRepository;
    private final MenuRepository menuRepository;
    private final OptionRepository optionRepository;
    private final PointHistoryRepository pointRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public void saveSale(SaveSaleDto saveSaleDto){
        Sale sale = saleRepository.save(Sale.builder()
                .member(saveSaleDto.getMemberId() == null ? null :memberRepository.findById(saveSaleDto.getMemberId())
                        .orElseThrow(() -> new IllegalArgumentException("Member not found" + saveSaleDto.getMemberId())))
                .state("ACTIVE")
                .totalPrice(saveSaleDto.getTotalPrice())
                .build());

        saveSaleDto.getMenus()
                .forEach(saleItemDto ->{
                    detailRepository.save(SaleDetail.builder()
                            .sale(sale)
                            .menu(menuRepository.findById(saleItemDto.getMenuId())
                                    .orElseThrow(() -> new IllegalArgumentException("Error: 미등록 메뉴 " + saleItemDto.getMenuId())))
                            .price(saleItemDto.getPrice())
                            .quantity(saleItemDto.getQuantity())
                            .menuOption(saleItemDto.getOptionId().stream()
                                    .map(id -> optionRepository.findNameById(id).orElseThrow(() -> new IllegalArgumentException("Error: 미등록 옵션 " + id)))
                                    .collect(Collectors.joining(" ")))
                            .build());
                });

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
                                .usePoint(salePaymentDto.getPrice());
                    }
                });

    }

    public ShowSaleSummaryDto showSale(SaleSummaryDateDto saleSummaryDateDto){

        System.out.println(saleRepository.getTotalmember(saleSummaryDateDto.getStartDate(), saleSummaryDateDto.getEndDate()));
        System.out.println(saleRepository.findPaymentByDate(saleSummaryDateDto.getStartDate(), saleSummaryDateDto.getEndDate()));
        System.out.println(saleRepository.findSummaryMenuByDate(saleSummaryDateDto.getStartDate(), saleSummaryDateDto.getEndDate()).stream()
                .map(arr -> new SummaryMenuDto((String) arr[0] + " " + arr[1], (Long) arr[2], (Long) arr[3])).collect(Collectors.toList()));


        return ShowSaleSummaryDto.builder()
                .totalMember(saleRepository.getTotalmember(saleSummaryDateDto.getStartDate(), saleSummaryDateDto.getEndDate()))
                .payments(saleRepository.findPaymentByDate(saleSummaryDateDto.getStartDate(), saleSummaryDateDto.getEndDate()))
                .menus(saleRepository.findSummaryMenuByDate(saleSummaryDateDto.getStartDate(), saleSummaryDateDto.getEndDate()).stream()
                        .map(arr -> new SummaryMenuDto((String) arr[0] + " " + arr[1], (Long) arr[2], (Long) arr[3])).collect(Collectors.toList()))
                .build();
       }
}





