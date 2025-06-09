package com.example.cafecontrolsystem.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@Schema(
        description = "결제 요청 DTO",
        example = """
                {
                  "memberId": 1,
                  "menus": [
                    {
                      "menuId": 1,
                      "quantity": 2,
                      "price": 3600,
                      "optionId": [2, 3]
                    },
                    {
                      "menuId": 2,
                      "quantity": 1,
                      "price": 2500,
                      "optionId": []
                    }
                  ],
                  "payments": [
                    {
                      "payment": "CASH",
                      "price": 3100
                    },
                    {
                      "payment": "POINT",
                      "price": 3000
                    }
                  ],
                  "totalPrice": 6100,
                  "earnedPoint": 61
                }
                """
)
public class SaveSaleDto {

    private Long memberId;

    private List<SaleItemDto> menus;

    private List<SalePaymentDto> payments;

    private Integer totalPrice;
    
    private Integer earnedPoint;
}
