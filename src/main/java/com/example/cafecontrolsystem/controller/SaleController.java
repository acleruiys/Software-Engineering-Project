package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.dto.*;
import com.example.cafecontrolsystem.entity.*;
import com.example.cafecontrolsystem.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Tag(name = "Sale-Controller", description = "Pay, Summary API Endpoint")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleRepository saleRepository;
    private final SaleDetailRepository detailRepository;
    private final PaymentRepository paymentRepository;
    private final MenuRepository menuRepository;
    private final OptionRepository optionRepository;
    private final PointHistoryRepository pointRepository;
    private final MemberRepository memberRepository;

    // @Transactional 처리를 위함
    @Resource(name = "saleController")
    @Lazy
    SaleController self;

    @Operation(
            summary = "결제 및 매출 데이터 저장",
            description = "현금, 카드, 포인트 결제 처리 및 포인트 적립",
            responses = {
                    @ApiResponse(responseCode = "200", description = "결제 성공"),
                    @ApiResponse(responseCode = "400", description = "에러 메시지 확인")
            }
    )
    @PostMapping("")
    public ResponseEntity<String> pay(@RequestBody SaveSaleDto saveSaleDto){
        self.saveSale(saveSaleDto);

        return ResponseEntity.ok("Success");
    }

    @Operation(
            summary = "매출 상세 조회",
            description = "주어진 날짜에 있는 매출 데이터 조회",
            responses = {
                    @ApiResponse(responseCode = "200", description = "조회 성공")
            }
    )
    @PostMapping("/summary")
    public ResponseEntity<ShowSaleSummaryDto> summary(@RequestBody SaleSummaryDateDto saleSummaryDateDto){
        return ResponseEntity.ok(showSaleSummary(saleSummaryDateDto));
    }


    @Transactional
    public void saveSale(SaveSaleDto saveSaleDto){

        Member member = saveSaleDto.getMemberId() == null ? null : memberRepository.findById(saveSaleDto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("Error: Member not found" + saveSaleDto.getMemberId()));

        // Sale DB에 Insert
        Sale sale = saleRepository.save(Sale.builder()
                .member(member)
                .state("ACTIVE")
                .totalPrice(saveSaleDto.getTotalPrice())
                .build());


        // 메뉴 별로 SaleDetail DB에 Insert
        saveSaleDto.getMenus()
                .forEach(saleItemDto -> {
                    detailRepository.save(SaleDetail.builder()
                            .sale(sale)
                            .menu(menuRepository.findById(saleItemDto.getMenuId())
                                    .orElseThrow(() -> new IllegalArgumentException("Error: 미등록 메뉴 " + saleItemDto.getMenuId())))
                            .price(saleItemDto.getPrice())
                            .quantity(saleItemDto.getQuantity())
                            .menuOption(saleItemDto.getOptionId() == null ? "" :
                                    saleItemDto.getOptionId().stream()
                                            .map(id -> optionRepository.findNameById(id).orElseThrow(
                                                    () -> new IllegalArgumentException("Error: 미등록 옵션 " + id))
                                            )
                                            .collect(Collectors.joining(" ")))
                            .build());
                });


        // 결제
        saveSaleDto.getPayments()
                .forEach(salePaymentDto -> {
                    switch (salePaymentDto.getPayment()){
                        case CASH:
                            payByCash(sale, salePaymentDto);
                            accumulatePoint(sale, member, saveSaleDto);
                            break;
                        case CARD:
                            payByCard(sale, salePaymentDto);
                            accumulatePoint(sale, member, saveSaleDto);
                            break;
                        case POINT:
                            payByPoint(sale, member, salePaymentDto);
                            break;
                        default:
                            throw new IllegalArgumentException("Error: 지원하지 않는 결제 방식: " + salePaymentDto.getPayment());
                    }
                });

    }


    // 현금 결제
    public void payByCash(Sale sale, SalePaymentDto salePaymentDto){
        paymentRepository.save(Payment.builder()
                .sale(sale)
                .method(salePaymentDto.getPayment().name())
                .price(salePaymentDto.getPrice())
                .build());
    }

    // 카드 결제
    public void payByCard(Sale sale, SalePaymentDto salePaymentDto){
        paymentRepository.save(Payment.builder()
                .sale(sale)
                .method(salePaymentDto.getPayment().name())
                .price(salePaymentDto.getPrice())
                .build());
    }

    // 포인트 결제
    public void payByPoint(Sale sale, Member member, SalePaymentDto salePaymentDto){

        // member가 null일 때 에러 처리
        if(member == null){
            throw new IllegalArgumentException("Error: MemberId must not be null when using POINT payment");
        }

        // member point가 가격보다 낮을 경우 에러 처리
        else if(member.getPoints() < salePaymentDto.getPrice()){
            throw new IllegalArgumentException("Error: Member point must not be less than price");
        }
        else {
            paymentRepository.save(Payment.builder()
                    .sale(sale)
                    .method(salePaymentDto.getPayment().name())
                    .price(salePaymentDto.getPrice())
                    .build());

            // 포인터 처리
            member.usePoint(salePaymentDto.getPrice());

            savePointHistory(member, sale, salePaymentDto.getPrice(), "USE");
        }
    }

    private void accumulatePoint(Sale sale, Member member, SaveSaleDto saveSaleDto){
        // Member 존재할 경우 PointHistory DB에 Insert 및 포인트 적립
        if(member != null){
            // 전달받은 적립 포인트 사용 (없으면 기본 1% 계산)
            int earnedPoint = saveSaleDto.getEarnedPoint() != null ?
                    saveSaleDto.getEarnedPoint() :
                    (int) Math.round(saveSaleDto.getTotalPrice() * 0.01);

            member.accumulatePoint(earnedPoint);

            savePointHistory(member, sale, earnedPoint, "REWARD");
        }
    }

    // PointHistory DB에 내역 Insert
    private void savePointHistory(Member member, Sale sale, int amount, String type){
        pointRepository.save(PointHistory.builder()
                .member(member)
                .sale(sale)
                .amount(amount)
                .type(type)
                .build());
    }


    public ShowSaleSummaryDto showSaleSummary(SaleSummaryDateDto saleSummaryDateDto){
        List<Object[]> totalInfo = saleRepository.getTotalmember(saleSummaryDateDto.getStartDate(), saleSummaryDateDto.getEndDate());
        return ShowSaleSummaryDto.builder()
                .totalMember((Long) totalInfo.getFirst()[0])
                .totalPrice((Long) totalInfo.getFirst()[1])
                .payments(saleRepository.findPaymentByDate(saleSummaryDateDto.getStartDate(), saleSummaryDateDto.getEndDate()))
                .menus(saleRepository.findSummaryMenuByDate(saleSummaryDateDto.getStartDate(), saleSummaryDateDto.getEndDate()).stream()
                        .map(arr -> new SummaryMenuDto((String) (arr[0] + " " + arr[1]), (String) arr[2], ((BigDecimal) arr[3]).longValue(), ((BigDecimal) arr[4]).longValue())).collect(Collectors.toList()))
                .build();
    }


    @ExceptionHandler(value = IllegalArgumentException.class)
    public ResponseEntity<String> IllegalArgument(IllegalArgumentException e){
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

}
