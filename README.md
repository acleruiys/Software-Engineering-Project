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

#### 1. Menu 테이블 (menus)
- `id`: 메뉴 아이디 (PK)
- `name`: 메뉴 이름 (NOT NULL)
- `price`: 가격 (NOT NULL)
- `category_id`: 카테고리 아이디 (FK)
- `description`: 메뉴 설명 (최대 500자)
- `available`: 판매 가능 여부 (기본값: true)

#### 2. MenuCategory 테이블 (menu_categories)
- `category_id`: 카테고리 아이디 (PK)
- `type`: 카테고리 타입 (ENUM: COFFEE, DECAF, NON_COFFEE, TEA, SMOOTHIE, ADE, SEASON, BREAD)
- `name`: 카테고리 이름 (NOT NULL)
- `description`: 카테고리 설명
- `status`: 카테고리 상태 (ENUM: ACTIVE, INACTIVE)
- `created_at`: 생성 날짜/시간
- `updated_at`: 수정 날짜/시간

#### 3. Sale 테이블 (sales)
- `sale_id`: 판매 아이디 (PK)
- `date`: 판매 날짜 (NOT NULL)
- `payment_method_id`: 결제 방법 아이디 (FK, NOT NULL)
- `total_amount`: 총 판매 금액 (NOT NULL)
- `discount_amount`: 할인 금액 (기본값: 0)
- `final_amount`: 최종 금액 (NOT NULL)
- `status`: 판매 상태 (ENUM: COMPLETED, CANCELLED, REFUNDED)
- `notes`: 메모
- `created_by`: 생성자 아이디 (FK, NOT NULL)
- `created_at`: 생성 날짜/시간
- `updated_by`: 수정자 아이디 (FK)
- `updated_at`: 수정 날짜/시간

#### 4. SaleItem 테이블 (sale_items)
- `sale_item_id`: 판매 항목 아이디 (PK)
- `sale_id`: 판매 아이디 (FK, NOT NULL)
- `menu_id`: 메뉴 아이디 (FK, NOT NULL)
- `quantity`: 수량 (NOT NULL)
- `unit_price`: 단가 (NOT NULL)
- `discount`: 할인 금액 (기본값: 0)
- `subtotal`: 소계 금액 (NOT NULL)

#### 5. User 테이블 (users)
- `user_id`: 사용자 아이디 (PK)
- `username`: 사용자명 (NOT NULL, UNIQUE)
- `password`: 비밀번호 (NOT NULL)
- `phone`: 전화번호 (NOT NULL)
- `role`: 사용자 역할 (ENUM: ADMIN, MANAGER, STAFF)
- `status`: 사용자 상태 (ENUM: ACTIVE, INACTIVE)
- `created_at`: 생성 날짜/시간
- `updated_at`: 수정 날짜/시간

#### 6. PaymentMethod 테이블 (payment_methods)
- `payment_method_id`: 결제 방법 아이디 (PK)
- `name`: 결제 방법 이름 (NOT NULL)
- `description`: 결제 방법 설명
- `status`: 결제 방법 상태 (ENUM: ACTIVE, INACTIVE)
- `created_at`: 생성 날짜/시간
- `updated_at`: 수정 날짜/시간

### 관계 구조

1. **Menu**와 **MenuCategory**:
   - 다대일(N:1) 관계: 하나의 카테고리는 여러 메뉴를 가질 수 있음

2. **Sale**과 **SaleItem**:
   - 일대다(1:N) 관계: 하나의 판매는 여러 판매 항목을 가질 수 있음
   
3. **Sale**과 **PaymentMethod**:
   - 다대일(N:1) 관계: 하나의 결제 방법으로 여러 판매가 발생할 수 있음

4. **Sale**과 **User**:
   - 다대일(N:1) 관계: 하나의 사용자는 여러 판매를 생성할 수 있음
   
5. **SaleItem**과 **Menu**:
   - 다대일(N:1) 관계: 하나의 메뉴는 여러 판매 항목에 포함될 수 있음

## 패키지 구조
- `controller/`: REST API 엔드포인트 및 웹 요청 처리
- `service/`: 비즈니스 로직 처리
- `repository/`: 데이터베이스 접근 인터페이스
- `entity/`: 데이터베이스 테이블과 매핑되는 엔티티 클래스
