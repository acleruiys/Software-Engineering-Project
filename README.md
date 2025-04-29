# 카페 관리 시스템 (Cafe Control System)

## 개발 환경
- Java 21
- Spring Boot
- MySQL 8.0 (5.6 이상 호환)

## 프로젝트 설정

### 데이터베이스 설정 (application.properties)
```
spring.datasource.url=jdbc:mysql://localhost:3306/cafe_db?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=비밀번호입력
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

### 실행 전 필수 확인 사항
- 데이터베이스 이름을 자신에 맞는 데이터베이스로 수정 (`cafe_db` 부분)
- 데이터베이스 유저이름과 비밀번호 수정
- 그 외 수정 금지

### 데이터베이스 오류 해결 방법
- IntelliJ에서 데이터베이스를 생성, 생성된 데이터베이스 우클릭 -> 프로퍼티 -> 하단 연결 테스트
- 오류 42000 (데이터베이스가 없어서 생기는 오류): 
  1. 윈도우 검색창 -> MySQL Command Line Client 클릭
  2. `CREATE DATABASE 원하는이름` 입력 후 엔터
  3. 다시 테스트 실행
- 그래도 안되면 실행 전 필수사항 확인, 그래도 또 안되면 연락 부탁드립니다.

## 데이터베이스 구조

### 테이블 구조

#### Menu 테이블
- `id`: 메뉴 아이디 (PK)
- `name`: 메뉴 이름
- `price`: 가격
- `category_id`: 카테고리 아이디 (FK)
- `description`: 메뉴 설명
- `available`: 판매 가능 여부

#### MenuCategory 테이블
- `category_id`: 카테고리 아이디 (PK)
- `type`: 카테고리 타입
- `name`: 카테고리 이름
- `description`: 카테고리 설명
- `status`: 카테고리 상태 (ACTIVE/INACTIVE)
- `created_at`: 생성 날짜/시간
- `updated_at`: 수정 날짜/시간

#### Sale 테이블(수정 축약 필요)
- `sale_id`: 판매 아이디 (PK)
- `date`: 판매 날짜
- `payment_method_id`: 결제 방법 (FK)
- `total_amount`: 총 판매 금액
- `discount_amount`: 할인 금액
- `final_amount`: 최종 금액
- `status`: 판매 상태 (COMPLETED/CANCELLED/REFUNDED)
- `notes`: 메모
- `created_by`: 생성자 (FK)
- `created_at`: 생성 날짜/시간
- `updated_by`: 수정자 (FK)
- `updated_at`: 수정 날짜/시간

## 패키지 구조
- `controller/`: REST API 엔드포인트 및 웹 요청 처리
- `service/`: 비즈니스 로직 처리
- `repository/`: 데이터베이스 접근 인터페이스
- `entity/`: 데이터베이스 테이블과 매핑되는 엔티티 클래스
