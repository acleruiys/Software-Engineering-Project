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

#### 1. menus (메뉴 테이블)
- `id`: 메뉴 아이디 (PK, 자동 증가)
- `name`: 메뉴 이름 (NOT NULL)
- `price`: 가격 (NOT NULL)
- `category_id`: 카테고리 아이디 (FK)
- `description`: 메뉴 설명 (최대 500자)
- `available`: 판매 가능 여부 (기본값: true)

#### 2. menu_categories (메뉴 카테고리 테이블)
- `category_id`: 카테고리 아이디 (PK, 자동 증가)
- `type`: 카테고리 타입 (ENUM: COFFEE, DECAF, NON_COFFEE, TEA, SMOOTHIE, ADE, SEASON, BREAD)
- `name`: 카테고리 이름 (NOT NULL)
- `description`: 카테고리 설명
- `status`: 카테고리 상태 (ENUM: ACTIVE, INACTIVE)

#### 3. sale (판매 테이블)
- `id`: 판매 아이디 (PK, 자동 증가)
- `created_at`: 생성 날짜/시간
- `state`: 판매 상태
- `total_price`: 총 판매 금액

#### 4. sale_detail (판매 항목 테이블)
- `detail_id`: 판매 항목 아이디 (PK, 자동 증가)
- `sale_id`: 판매 아이디 (FK)
- `menu_id`: 메뉴 아이디 (FK)
- `quantity`: 수량
- `option_id`: 옵션 아이디 (FK)

#### 5. users (사용자 테이블)
- `user_id`: 사용자 아이디 (PK, 자동 증가)
- `username`: 사용자명 (NOT NULL, UNIQUE)
- `password`: 비밀번호 (NOT NULL)
- `phone`: 전화번호 (NOT NULL)
- `role`: 사용자 역할 (ENUM: ADMIN, MANAGER, STAFF)
- `status`: 사용자 상태 (ENUM: ACTIVE, INACTIVE)

#### 6. payment_methods (결제 방법 테이블)
- `payment_method_id`: 결제 방법 아이디 (PK, 자동 증가)
- `name`: 결제 방법 이름 (NOT NULL)
- `description`: 결제 방법 설명
- `status`: 결제 방법 상태 (ENUM: ACTIVE, INACTIVE)
- `created_at`: 생성 날짜/시간
- `updated_at`: 수정 날짜/시간

#### 7. payment (결제 테이블)
- `payment_id`: 결제 아이디 (PK, 자동 증가)
- `sale_id`: 판매 아이디 (FK)
- `method_id`: 결제 방법 아이디 (FK)
- `price`: 결제 금액

#### 8. member (회원 테이블)
- `member_id`: 회원 아이디 (PK)
- `name`: 회원 이름
- `phone`: 전화번호
- `points`: 포인트

#### 9. point_history (포인트 내역 테이블)
- `id`: 포인트 내역 아이디 (PK, 자동 증가)
- `member_id`: 회원 아이디 (FK)
- `sale_id`: 판매 아이디 (FK)
- `type`: 유형
- `amount`: 금액
- `created_at`: 생성 날짜/시간

#### 10. option_table (옵션 테이블)
- `option_code`: 옵션 코드 (PK)
- `name`: 옵션 이름
- `available`: 이용 가능 여부
- `price`: 옵션 가격

#### 11. inventory (재고 테이블)
- `inventory_id`: 재고 아이디 (PK, 자동 증가)
- `name`: 재고 품목 이름 (NOT NULL)
- `category_id`: 재고 카테고리 아이디 (FK)
- `supply_id`: 공급업체 아이디 (FK)
- `price`: 가격 (NOT NULL)
- `quantity`: 수량 (NOT NULL)

#### 12. inventory_category (재고 카테고리 테이블)
- `id`: 재고 카테고리 아이디 (PK, 자동 증가)
- `name`: 재고 카테고리 이름 (NOT NULL)

#### 13. supply (공급업체 테이블)
- `id`: 공급업체 아이디 (PK, 자동 증가)
- `name`: 공급업체 이름
- `manager`: 담당자
- `phone`: 전화번호

#### 14. inventory_history (재고 이력 테이블)
- `id`: 재고 이력 아이디 (PK, 자동 증가)
- `employee_id`: 직원 아이디 (FK)
- `inventory_id`: 재고 아이디 (FK)
- `type`: 유형
- `change`: 변화량
- `date`: 날짜

#### 15. employee (직원 테이블)
- `employee_id`: 직원 아이디 (PK)
- `name`: 직원 이름
- `position`: 직책
- `salary`: 급여

#### 16. employee_attendance (직원 출결 테이블)
- `id`: 출결 아이디 (PK, 자동 증가)
- `employee_id`: 직원 아이디 (FK)
- `clock_in`: 출근 시간
- `clock_out`: 퇴근 시간
- `work_hour`: 근무 시간
- `date`: 날짜

#### 17. daily_sale (일일 매출 테이블)
- `id`: 일일 매출 아이디 (PK, 자동 증가)
- `date`: 날짜
- `cash`: 현금 매출
- `card`: 카드 매출
- `point`: 포인트 사용 금액

#### 18. monthly_expense (월별 지출 테이블)
- `id`: 지출 아이디 (PK, 자동 증가)
- `date`: 날짜
- `monthly_fee`: 월 고정비
- `additional_fee`: 추가 비용
- `maintenance_fee`: 유지보수 비용
- `wage_expense`: 임금 지출
- `supply_fee`: 공급 비용
- `monthly_expensecol`: 기타 설명

### 관계 구조

1. **Menu**와 **MenuCategory**:
   - 다대일(N:1) 관계: 하나의 카테고리는 여러 메뉴를 가질 수 있음

2. **Sale**과 **SaleDetail**:
   - 일대다(1:N) 관계: 하나의 판매는 여러 판매 항목을 가질 수 있음
   
3. **Sale**과 **Payment**:
   - 일대다(1:N) 관계: 하나의 판매는 여러 결제 항목을 가질 수 있음

4. **Payment**와 **PaymentMethod**:
   - 다대일(N:1) 관계: 하나의 결제 방법으로 여러 결제가 발생할 수 있음
   
5. **SaleDetail**과 **Menu**:
   - 다대일(N:1) 관계: 하나의 메뉴는 여러 판매 항목에 포함될 수 있음

6. **SaleDetail**과 **Option**:
   - 다대일(N:1) 관계: 하나의 옵션은 여러 판매 항목에 포함될 수 있음

7. **Member**와 **PointHistory**:
   - 일대다(1:N) 관계: 하나의 회원은 여러 포인트 내역을 가질 수 있음

8. **Sale**과 **PointHistory**:
   - 일대다(1:N) 관계: 하나의 판매는 여러 포인트 내역을 가질 수 있음

9. **Inventory**와 **InventoryCategory**:
   - 다대일(N:1) 관계: 하나의 재고 카테고리는 여러 재고 항목을 가질 수 있음

10. **Inventory**와 **Supply**:
    - 다대일(N:1) 관계: 하나의 공급업체는 여러 재고 항목을 공급할 수 있음

11. **Employee**와 **EmployeeAttendance**:
    - 일대다(1:N) 관계: 하나의 직원은 여러 출결 기록을 가질 수 있음

12. **Employee**와 **InventoryHistory**:
    - 일대다(1:N) 관계: 하나의 직원은 여러 재고 이력을 생성할 수 있음

13. **Inventory**와 **InventoryHistory**:
    - 일대다(1:N) 관계: 하나의 재고 항목은 여러 재고 이력을 가질 수 있음

## 패키지 구조
- `controller/`: REST API 엔드포인트 및 웹 요청 처리
- `service/`: 비즈니스 로직 처리
- `repository/`: 데이터베이스 접근 인터페이스
- `entity/`: 데이터베이스 테이블과 매핑되는 엔티티 클래스
