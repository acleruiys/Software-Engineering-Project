/**
 * 카페 관리 시스템 메인 애플리케이션 클래스
 * 
 * 이 클래스는 Spring Boot 애플리케이션의 진입점입니다.
 * 다음과 같은 기능을 초기화합니다:
 * 
 * 1. Spring Boot 자동 설정
 * 2. 컴포넌트 스캔
 * 3. JPA Auditing 활성화 (생성/수정 시간 자동 기록)
 * 
 * 패키지 구조:
 * - controller/: REST API 엔드포인트 및 웹 요청 처리
 * - service/: 비즈니스 로직 처리
 * - repository/: 데이터베이스 접근 인터페이스
 * - entity/: 데이터베이스 테이블과 매핑되는 엔티티 클래스
 * 
 * @EnableJpaAuditing: JPA Auditing 기능 활성화
 * @SpringBootApplication: 스프링 부트 자동 설정, 컴포넌트 스캔 활성화
 */
package com.example.cafecontrolsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CafeControlSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(CafeControlSystemApplication.class, args);
	}

}
