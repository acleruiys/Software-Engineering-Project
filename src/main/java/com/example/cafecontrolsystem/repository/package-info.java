/**
 * 카페 관리 시스템의 리포지토리 계층
 * 
 * 이 패키지는 데이터베이스 접근을 담당하는 JPA 리포지토리 인터페이스들을 포함합니다.
 * 
 * 주요 리포지토리:
 * - CategoryRepository: 카테고리 엔티티 관리
 * - MenuRepository: 메뉴 엔티티 관리
 * - SaleRepository: 판매 기록 관리
 * - UserRepository: 사용자 정보 관리
 * - PaymentMethodRepository: 결제 수단 관리
 * 
 * 리포지토리 특징:
 * 1. JpaRepository 인터페이스 상속
 * 2. 기본 CRUD 작업 자동 제공
 * 3. 커스텀 쿼리 메소드 정의
 * 4. 페이징 및 정렬 지원
 */
package com.example.cafecontrolsystem.repository; 