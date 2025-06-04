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
    private final PaymentMethodRepository paymentMethodRepository;

    @Transactional
    public void saveSale(SaveSaleDto saveSaleDto){
        Sale sale = saleRepository.save(Sale.builder()
                .member(saveSaleDto.getMemberId() == null ? null :memberRepository.findById(saveSaleDto.getMemberId())
                        .orElseThrow(() -> new IllegalArgumentException("Member not found" + saveSaleDto.getMemberId())))
                .state("ACTIVE")
                .totalPrice(saveSaleDto.getTotalPrice())
                .build());


        if(saveSaleDto.getMemberId() != null){
            Member m = memberRepository.findById(saveSaleDto.getMemberId()).orElseThrow(() -> new IllegalArgumentException("Member not found" + saveSaleDto.getMemberId()));
            m.accumulatePoint((int) (saveSaleDto.getTotalPrice() * 0.01));
            pointRepository.save(PointHistory.builder()
                    .member(m)
                    .sale(sale)
                    .amount((int) (saveSaleDto.getTotalPrice() * 0.01))
                    .type("reward")
                    .build());
        }

        saveSaleDto.getMenus()
                .forEach(saleItemDto ->{
                    detailRepository.save(SaleDetail.builder()
                            .sale(sale)
                            .menu(menuRepository.findById(saleItemDto.getMenuId())
                                    .orElseThrow(() -> new IllegalArgumentException("Error: 미등록 메뉴 " + saleItemDto.getMenuId())))
                            .price(saleItemDto.getPrice())
                            .quantity(saleItemDto.getQuantity())
                            .menuOption(saleItemDto.getOptionId() == null ? "" : 
                                    saleItemDto.getOptionId().stream()
                                    .map(id -> optionRepository.findNameById(id).orElseThrow(() -> new IllegalArgumentException("Error: 미등록 옵션 " + id)))
                                    .collect(Collectors.joining(" ")))
                            .build());
                });

        saveSaleDto.getPayments()
                .forEach(salePaymentDto -> {

                    Optional<Member> memberOpt = saveSaleDto.getMemberId() == null ? Optional.empty() : memberRepository.findById(saveSaleDto.getMemberId());

                    if (salePaymentDto.getPayment().equals("POINT")) {
                        if (saveSaleDto.getMemberId() == null) {
                            throw new IllegalArgumentException("MemberId must not be null when using POINT payment.");
                        }

                        Member member = memberOpt.orElseThrow(() -> new IllegalArgumentException("Member Not Found"));

                        if (member.getPoints() < salePaymentDto.getPrice()) {
                            throw new IllegalArgumentException("Member point must not be less than price");
                        }

                        pointRepository.save(PointHistory.builder()
                                .member(member)
                                .sale(sale)
                                .amount(salePaymentDto.getPrice())
                                .type("use")
                                .build());

                        member.usePoint(salePaymentDto.getPrice());


                    } else {
                        paymentRepository.save(Payment.builder()
                                .sale(sale)
                                .method(paymentMethodRepository.findByName(salePaymentDto.getPayment())
                                        .orElseThrow(() -> new IllegalArgumentException("Error: 미등록 결제방법 " + salePaymentDto.getPayment())))
                                .price(salePaymentDto.getPrice())
                                .build());
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