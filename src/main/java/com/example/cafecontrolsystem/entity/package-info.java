/**
 * 카페 관리 시스템의 엔티티 계층
 * 
 * 이 패키지는 데이터베이스 테이블과 매핑되는 JPA 엔티티 클래스들을 포함합니다.
 * 
 * 주요 엔티티:
 * - MenuCategory: 메뉴 카테고리 정보
 * - Menu: 메뉴 정보
 * - Sale: 판매 정보
 * - SaleItem: 판매 항목 상세
 * - User: 사용자 정보
 * - PaymentMethod: 결제 수단 정보
 * 
 * 공통 특징:
 * 1. @Entity 어노테이션 사용
 * 2. ID 필드 자동 생성
 * 3. 생성/수정 시간 자동 기록
 * 4. Lombok 어노테이션 활용
 * 
 * 엔티티 관계:
 * - Menu -> MenuCategory (N:1)
 * - SaleItem -> Menu (N:1)
 * - SaleItem -> Sale (N:1)
 * - Sale -> PaymentMethod (N:1)
 * - Sale -> User (N:1)
 */
package com.example.cafecontrolsystem.entity; 