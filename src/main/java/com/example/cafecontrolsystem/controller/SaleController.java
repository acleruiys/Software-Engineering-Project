package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.dto.SaleSummaryDateDto;
import com.example.cafecontrolsystem.dto.SaveSaleDto;
import com.example.cafecontrolsystem.dto.ShowSaleSummaryDto;
import com.example.cafecontrolsystem.service.SaleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Sale-Controller", description = "Pay, Summary API Endpoint")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;

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
        saleService.saveSale(saveSaleDto);

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
        return ResponseEntity.ok(saleService.showSale(saleSummaryDateDto));
    }

    @ExceptionHandler(value = IllegalArgumentException.class)
    public ResponseEntity<String> IllegalArgument(IllegalArgumentException e){
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

}
