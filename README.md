# 카페 관리 시스템 (Cafe Control System)

## 개요
    - 카페 관리 시스템은 카페의 메뉴, 재고, 판매 및 결제 관리를 위한 웹 애플리케이션입니다. 
    - 이 시스템은 카페 운영에 필요한 다양한 기능을 제공하여 효율적인 관리와 운영을 지원합니다.
    - 주요 기능으로는 메뉴 관리, 재고 관리, 판매 및 결제 처리, 직원 관리 등이 포함되어 있습니다.
## 개발 환경
- Java 21, 17 이상
- Spring Boot 3.2.1
- MySQL 8.0 (5.6 이상 호환)
- Gradle 8.5
- intellij
- JPA/Hibernate
- Spring Security
- Thymeleaf
- JUnit 5

## 프로그래밍 언어 및 프레임워크 상세

### Java
- Java 21 또는 17 이상 버전 사용
- 주요 사용 패키지:
  - `java.util`: 컬렉션, 날짜/시간 처리
  - `java.security`: 보안 관련 기능 (비밀번호 암호화 등)
  - `java.time`: 날짜/시간 API
  - `javax.persistence`: JPA 관련 어노테이션
- 객체지향 프로그래밍 원칙 준수
- 예외 처리 및 로깅 구현
- 스트림 API 활용한 데이터 처리

### JavaScript
- ES6+ 문법 사용
- 모듈화된 구조:
  - 클래스 기반 컴포넌트 구현
  - 비동기 처리 (async/await)
  - 이벤트 기반 프로그래밍
- 주요 기능:
  - DOM 조작 및 이벤트 처리
  - AJAX를 통한 비동기 통신
  - 폼 유효성 검증
  - 동적 UI 업데이트
- 외부 라이브러리:
  - Chart.js: 매출 데이터 시각화
  - SweetAlert2: 사용자 알림
  - Axios: HTTP 클라이언트

### HTML
- HTML5 표준 준수
- 시맨틱 태그 활용:
  - `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- 반응형 웹 디자인:
  - 미디어 쿼리 사용
  - Flexbox/Grid 레이아웃
- 접근성 고려:
  - ARIA 레이블 사용
  - 키보드 네비게이션 지원
- Thymeleaf 템플릿 엔진 활용:
  - 동적 콘텐츠 렌더링
  - 레이아웃 재사용
  - 국제화(i18n) 지원

## 사용자 인증 및 보안

### 인증 시스템 (관리자 및 직원)
- 사용자 로그인/회원가입 기능 구현
- 관리자(ADMIN), 매니저(MANAGER), 직원(STAFF) 역할 구분
- 회원가입 시 사용자 역할 선택 기능 구현
- 입력 폼 유효성 검증 및 자동 전화번호 형식화 기능
- 세션 기반 인증 처리

### 비밀번호 암호화 (데이터베이스에 암호화로 데이터{비밀번호} 저장)
- 단방향 SHA-256 해시 알고리즘 사용
- Base64 인코딩 적용
- 암호화 과정:
  1. MessageDigest를 사용하여 SHA-256 해시 알고리즘 인스턴스 생성
  2. 비밀번호 문자열을 UTF-8 바이트 배열로 변환
  3. 해시 알고리즘을 통해 바이트 배열 해시화
  4. 해시된 바이트 배열을 Base64로 인코딩하여 저장

### 보안 컴포넌트
- UserService: 사용자 등록 및 인증 처리
- UserRepository: 사용자 정보 데이터베이스 접근
- UserController: 사용자 API 엔드포인트 제공
- 로그인/회원가입 페이지: 사용자 인증 인터페이스

### 입력 검증 및 예외 처리
- 클라이언트 측 검증:
  - 모든 필수 필드 입력 확인
  - 비밀번호 일치 여부 확인
  - 전화번호 형식 검증 (정규식 이용)
  - 사용자 입력 시 자동 전화번호 형식화 (010-xxxx-xxxx)
  
- 서버 측 검증:
  - 사용자명 길이 제한 (2~20자)
  - 비밀번호 길이 제한 (4~20자)
  - 전화번호 형식 검증 (정규식 이용)
  - 역할 유효성 검증 (ADMIN, MANAGER, STAFF)
  - 중복 사용자명 및 전화번호 검증
  
- 예외 처리:
  - 클라이언트 측: alert 메시지로 사용자에게 오류 알림
  - 서버 측: HTTP 상태 코드와 함께 오류 메시지 반환
  - 상세한 오류 메시지를 통한 사용자 경험 개선

### GitHub 연동 및 사용 방법 (IntelliJ)

1. GitHub 저장소 클론
   - IntelliJ 실행 -> `File` -> `New` -> `Project from Version Control`
   - URL에 `https://github.com/[사용자명]/[저장소명].git` 입력
   - 원하는 디렉토리 선택 후 `Clone` 클릭

2. 브랜치 생성 및 전환
   - 하단 `Git` -> `New Branch` 클릭
   - 브랜치 이름 입력 (예: feature/login)
   - `Create` 클릭

3. 변경사항 커밋
   - 좌측 `Project` 탭에서 변경된 파일 확인
   - 변경 파일 우클릭 -> `Git` -> `Add` 선택
   - 상단 메뉴 `Git` -> `Commit` 클릭
   - 커밋 메시지 작성 후 `Commit` 클릭

4. 원격 저장소에 푸시
   - 상단 메뉴 `Git` -> `Push` 클릭
   - 변경사항 확인 후 `Push` 클릭

5. Pull Request 생성
   - GitHub 웹사이트 접속
   - `Pull requests` 탭 클릭
   - `New pull request` 클릭
   - base와 compare 브랜치 선택
   - 내용 작성 후 `Create pull request` 클릭

주의사항:
- 커밋 전 항상 최신 코드를 pull 받기
- 의미 있는 커밋 메시지 작성하기
- 코드 리뷰 후 merge 진행하기

### 데이터베이스 설정 (application.properties)
```
spring.datasource.url=jdbc:mysql://localhost:3306/cafe_db?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=비밀번호입력
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

### 실행 전 필수 확인 사항
- 데이터베이스 실행사항 확인
- 데이터베이스 이름을 자신에 맞는 데이터베이스로 수정 (`cafe_db` 부분)
- 데이터베이스 유저이름과 비밀번호 수정
- JPA 설정의 `ddl-auto` 값이 `update`로 설정되어 있는지 확인 (처음 실행 시 `create`로 변경 가능)
- 그 외 수정 금지

### 데이터베이스 오류 해결 방법
- MySQL 실행 확인
- IntelliJ에서 데이터베이스를 생성, 생성된 데이터베이스 우클릭 -> 프로퍼티 -> 하단 연결 테스트
- 오류 42000 (데이터베이스가 없어서 생기는 오류): 
  1. 윈도우 검색창 -> MySQL Command Line Client 클릭
  2. `CREATE DATABASE 원하는이름` 입력 후 엔터
  3. 다시 테스트 실행
- MySQL 8.0 이상 사용자 생성 및 권한 부여:
  ```sql
  CREATE USER '사용자명'@'localhost' IDENTIFIED BY '비밀번호';
  GRANT ALL PRIVILEGES ON 데이터베이스명.* TO '사용자명'@'localhost';
  FLUSH PRIVILEGES;
  ```
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
- `password`: 비밀번호 (NOT NULL, SHA-256 해시 + Base64 인코딩)
- `phone`: 전화번호 (NOT NULL)
- `role`: 사용자 역할 (ENUM: ADMIN, MANAGER, STAFF)
- `status`: 사용자 상태 (ENUM: ACTIVE, INACTIVE)

#### 6. payment_method (결제 방법 테이블)
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
- `password`: 4자리 비밀번호 (NOT NULL)
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

#### 11. menu_option (메뉴 옵션 테이블)
- `option_code`: 옵션 코드 (PK, 자동 증가)
- `name`: 옵션 이름
- `available`: 이용 가능 여부 (Boolean)
- `price`: 옵션 가격

#### 12. inventory (재고 테이블)
- `inventory_id`: 재고 아이디 (PK, 자동 증가)
- `name`: 재고 품목 이름 (NOT NULL)
- `category_id`: 재고 카테고리 아이디 (FK)
- `supply_id`: 공급업체 아이디 (FK)
- `price`: 가격 (NOT NULL)
- `quantity`: 수량 (NOT NULL)

#### 13. inventory_category (재고 카테고리 테이블)
- `id`: 재고 카테고리 아이디 (PK, 자동 증가)
- `name`: 재고 카테고리 이름 (NOT NULL)

#### 14. supply (공급업체 테이블)
- `id`: 공급업체 아이디 (PK, 자동 증가)
- `name`: 공급업체 이름
- `manager`: 담당자
- `phone`: 전화번호

#### 15. inventory_history (재고 이력 테이블)
- `id`: 재고 이력 아이디 (PK, 자동 증가)
- `employee_id`: 직원 아이디 (FK)
- `inventory_id`: 재고 아이디 (FK)
- `type`: 유형
- `change`: 변화량
- `date`: 날짜

#### 16. employee (직원 테이블)
- `employee_id`: 직원 아이디 (PK)
- `name`: 직원 이름
- `position`: 직책
- `salary`: 급여

#### 17. employee_attendance (직원 출결 테이블)
- `id`: 출결 아이디 (PK, 자동 증가)
- `employee_id`: 직원 아이디 (FK)
- `clock_in`: 출근 시간
- `clock_out`: 퇴근 시간
- `work_hour`: 근무 시간
- `date`: 날짜

#### 18. daily_sale (일일 매출 테이블)
- `id`: 일일 매출 아이디 (PK, 자동 증가)
- `date`: 날짜
- `cash`: 현금 매출
- `card`: 카드 매출
- `point`: 포인트 사용 금액

#### 19. monthly_expense (월별 지출 테이블)
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
   - JPA 매핑: `@ManyToOne`, `@OneToMany`

2. **Sale**과 **SaleDetail**:
   - 일대다(1:N) 관계: 하나의 판매는 여러 판매 항목을 가질 수 있음
   - JPA 매핑: `@OneToMany`, `@ManyToOne`
   
3. **Sale**과 **Payment**:
   - 일대다(1:N) 관계: 하나의 판매는 여러 결제 항목을 가질 수 있음
   - JPA 매핑: `@OneToMany`, `@ManyToOne`

4. **Payment**와 **PaymentMethod**:
   - 다대일(N:1) 관계: 하나의 결제 방법으로 여러 결제가 발생할 수 있음
   - JPA 매핑: `@ManyToOne`
   
5. **SaleDetail**과 **Menu**:
   - 다대일(N:1) 관계: 하나의 메뉴는 여러 판매 항목에 포함될 수 있음
   - JPA 매핑: `@ManyToOne`

6. **SaleDetail**과 **Option**:
   - 다대일(N:1) 관계: 하나의 옵션은 여러 판매 항목에 포함될 수 있음
   - JPA 매핑: `@ManyToOne`

7. **Member**와 **PointHistory**:
   - 일대다(1:N) 관계: 하나의 회원은 여러 포인트 내역을 가질 수 있음
   - JPA 매핑: `@OneToMany`, `@ManyToOne`

8. **Sale**과 **PointHistory**:
   - 일대다(1:N) 관계: 하나의 판매는 여러 포인트 내역을 가질 수 있음
   - JPA 매핑: `@OneToMany`, `@ManyToOne`

9. **Inventory**와 **InventoryCategory**:
   - 다대일(N:1) 관계: 하나의 재고 카테고리는 여러 재고 항목을 가질 수 있음
   - JPA 매핑: `@ManyToOne`

10. **Inventory**와 **Supply**:
    - 다대일(N:1) 관계: 하나의 공급업체는 여러 재고 항목을 공급할 수 있음
    - JPA 매핑: `@ManyToOne`

11. **Employee**와 **EmployeeAttendance**:
    - 일대다(1:N) 관계: 하나의 직원은 여러 출결 기록을 가질 수 있음
    - JPA 매핑: `@OneToMany`, `@ManyToOne`

12. **Employee**와 **InventoryHistory**:
    - 일대다(1:N) 관계: 하나의 직원은 여러 재고 이력을 생성할 수 있음
    - JPA 매핑: `@OneToMany`, `@ManyToOne`

13. **Inventory**와 **InventoryHistory**:
    - 일대다(1:N) 관계: 하나의 재고 항목은 여러 재고 이력을 가질 수 있음
    - JPA 매핑: `@OneToMany`, `@ManyToOne`

## 패키지 구조
- `controller/`: REST API 엔드포인트 및 웹 요청 처리
- `service/`: 비즈니스 로직 처리
- `repository/`: 데이터베이스 접근 인터페이스
- `entity/`: 데이터베이스 테이블과 매핑되는 엔티티 클래스
- `dto/`: 데이터 전송 객체 (서비스 계층과 컨트롤러 계층 간 데이터 교환)

## 웹 프론트엔드 구조
- HTML/CSS/JavaScript 기반 프론트엔드
- Thymeleaf 템플릿 엔진 사용
- 모듈화된 자바스크립트 컴포넌트:
  - 네비게이션바: `/js/main/Navbar.js`
  - 메뉴 탭: `/js/main/Tab.js`
  - 주문 목록: `/js/main/OrderList.js`
  - 카테고리 패널: `/js/main/CategoryPanel.js`
  - 메뉴 그리드: `/js/main/MenuGrid.js`
  - 결제 시스템: `/js/main/TotalBilling.js`

## 최근 업데이트 내역

### 2024-05-27 - 사용자 역할 선택 기능 추가
- 회원가입 시 사용자 역할(ADMIN, MANAGER, STAFF) 선택 기능 구현
- 입력 폼 유효성 검사 기능 강화
  - 전화번호 형식 자동 변환(010-xxxx-xxxx)
  - 서버/클라이언트 양쪽에서 전화번호 형식 검증
  - 사용자명, 비밀번호, 역할 등의 유효성 검증 강화
- 역할 기반 예외처리 추가
  - 유효하지 않은 역할 선택 시 오류 메시지 표시
  - 각 필드별 상세한 오류 메시지 제공

## 파일 구조 및 역할

### 프론트엔드 구조 (src/main/resources/static)

#### JavaScript 파일 (/js)

##### 메인 모듈 (/js/main)
- `App.js`: 애플리케이션의 진입점, 전체 앱 상태 관리
- `Component.js`: 모든 UI 컴포넌트의 기본 클래스, 상태 관리 및 렌더링 로직 포함
- `Navbar.js`: 상단 네비게이션 바 컴포넌트, 메뉴 이동 및 시간 표시
- `Tab.js`: 주문 화면의 탭 컴포넌트
- `OrderList.js`: 주문 목록 표시 및 관리
- `CategoryPanel.js`: 카테고리 선택 패널
- `MenuGrid.js`: 메뉴 목록 그리드 표시
- `Billing.js`: 주문 항목별 금액 계산
- `TotalBilling.js`: 총 결제 금액 계산 및 표시
- `TotalSection.js`: 주문 총합 정보 표시
- `RowButton.js`: 하단 버튼 행 컴포넌트
- `FooterPanel.js`: 푸터 영역 컴포넌트, 결제 버튼 등 포함

##### 데이터 관리 (/js/data)
- `MenuData.js`: 메뉴 데이터 정의 (카테고리, 메뉴 아이템)

##### 매출 관리 (/js/sales)
- `SalesTime.js`: 기간별 매출 조회 메인 컴포넌트
- `DailyView.js`: 일별 매출 조회 뷰
- `MonthlyView.js`: 월별 매출 조회 뷰
- `YearlyView.js`: 연도별 매출 조회 뷰
- `SalesFooter.js`: 매출 조회 화면 하단 요약 정보

##### 메뉴 관리 (/js/menu)
- `MenuSystem.js`: 메뉴 관리 시스템 컴포넌트

##### 재고 관리 (/js/inventory)
- `InventorySystem.js`: 재고 관리 시스템 컴포넌트

##### 직원 관리 (/js/employee)
- `EmployeeSystem.js`: 직원 관리 시스템 컴포넌트

##### 공급 관리 (/js/supply)
- `SupplySystem.js`: 공급업체 관리 시스템 컴포넌트

##### 유틸리티 (/js/utils)
- 다양한 유틸리티 함수 및 헬퍼 클래스

##### 인증 관련
- `login.js`: 로그인 처리
- `adminSignIn.js`: 관리자 로그인 처리

#### CSS 파일 (/css)
- `style.css`: 메인 스타일시트, 전체 애플리케이션 스타일 정의
- `AdminSignInStyle.css`: 관리자 로그인 페이지 스타일
- `AdminSignUpStyle.css`: 관리자 회원가입 페이지 스타일

#### HTML 템플릿 (/templates)
- `index.html`: 메인 애플리케이션 페이지
- 기타 템플릿 파일들

### 백엔드 구조 (src/main/java)

#### 컨트롤러 (controller/)
- 클라이언트 요청 처리 및 API 엔드포인트 제공
- REST API 및 뷰 컨트롤러 포함

#### 서비스 (service/)
- 비즈니스 로직 처리
- 데이터 검증 및 트랜잭션 관리

#### 저장소 (repository/)
- 데이터베이스 접근 인터페이스
- JPA Repository 구현체

#### 엔티티 (entity/)
- 데이터베이스 테이블과 매핑되는 Java 클래스
- 관계 및 제약조건 정의

#### DTO (dto/)
- 데이터 전송 객체
- 컨트롤러와 서비스 계층 간 데이터 교환에 사용

#### 예외 처리 (exception/)
- 사용자 정의 예외 클래스
- 글로벌 예외 핸들러

#### 설정 (config/)
- 애플리케이션 설정 클래스
- 보안 설정, 웹 설정 등

### 데이터베이스 마이그레이션 및 초기화
- `MenuInitializer.java`: 메뉴 초기 데이터 로드
- 기타 데이터 초기화 클래스

### 주요 기능별 파일 구조

#### 사용자 인증
- `UserController.java`: 사용자 인증 관련 API
- `UserService.java`: 사용자 서비스 로직
- `User.java`: 사용자 엔티티

#### 판매 관리
- `SaleController.java`: 판매 관련 API
- `SaleService.java`: 판매 서비스 로직
- `Sale.java`: 판매 엔티티
- `SaleDetail.java`: 판매 상세 엔티티

#### 메뉴 관리
- `MenuController.java`: 메뉴 관련 API
- `MenuService.java`: 메뉴 서비스 로직
- `Menu_entity.java`: 메뉴 엔티티
- `MenuCategory_entity.java`: 메뉴 카테고리 엔티티

#### 재고 관리
- `InventoryController.java`: 재고 관련 API
- `InventoryService.java`: 재고 서비스 로직
- `Inventory.java`: 재고 엔티티

#### 직원 관리
- `EmployeeController.java`: 직원 관련 API
- `EmployeeService.java`: 직원 서비스 로직
- `Employee.java`: 직원 엔티티

#### 공급업체 관리
- `SupplyController.java`: 공급업체 관련 API
- `SupplyService.java`: 공급업체 서비스 로직
- `Supply.java`: 공급업체 엔티티

### 회원 관리 시스템
- 회원 등록/수정/삭제 기능
- 회원별 포인트 관리
- 회원 인증 시스템:
  - 4자리 비밀번호 필수 입력
  - 전화번호로 회원 조회
  - 비밀번호 변경 기능
- 회원 정보 수정:
  - 이름, 전화번호, 비밀번호 변경 가능
  - 포인트 적립/사용 내역 관리
- 초기 회원 데이터:
  - 기본 비밀번호: "0000"
  - 회원 등록 시 4자리 비밀번호 필수 입력
  - 전화번호 중복 검증
