/**
 * 카페 관리 시스템의 컨트롤러 계층
 * 
 * 이 패키지는 클라이언트의 HTTP 요청을 처리하는 REST 컨트롤러들을 포함합니다.
 * 
 * 주요 컨트롤러:
 * - CategoryController: 카테고리 CRUD 작업 처리
 * - MenuController: 메뉴 관리 및 조회
 * - SaleController: 판매 및 결제 처리
 * - UserController: 사용자 관리
 * 
 * 각 컨트롤러는 다음과 같은 책임을 가집니다:
 * 1. HTTP 요청 처리
 * 2. 요청 데이터 검증
 * 3. 서비스 계층 호출
 * 4. 응답 데이터 구성
 */
package com.example.cafecontrolsystem.controller;