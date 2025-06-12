package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.dto.UpdateMemberDto;
import com.example.cafecontrolsystem.entity.Member;
import com.example.cafecontrolsystem.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
public class MemberController {

    private final MemberRepository memberRepository;

    // 모든 회원 목록 조회
    @GetMapping
    public ResponseEntity<List<Member>> getAllMembers() {
        List<Member> members = memberRepository.findAll();
        return ResponseEntity.ok(members);
    }

    // 휴대폰 번호로 회원 검색
    @GetMapping("/phone/{phone}")
    public ResponseEntity<?> getMemberByPhone(@PathVariable String phone) {
        Optional<Member> member = findByPhone(phone);
        if (member.isPresent()) {
            return ResponseEntity.ok(member.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "회원을 찾을 수 없습니다."));
        }
    }

    // 회원 ID로 조회
    @GetMapping("/{memberId}")
    public ResponseEntity<?> getMemberById(@PathVariable Long memberId) {
        try {
            Optional<Member> member = findById(memberId);
            if (member.isPresent()) {
                return ResponseEntity.ok(member.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "회원을 찾을 수 없습니다."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "서버 오류가 발생했습니다."));
        }
    }

    // 회원 등록
    @PostMapping
    public ResponseEntity<?> registerMember(@RequestBody Member member) {
        try {
            saveMember(member);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // 회원 비밀번호 검증
    @PostMapping("/{memberId}/verify-password")
    public ResponseEntity<?> verifyMemberPassword(@PathVariable(name = "memberId") Long memberId,
                                                 @RequestBody Map<String, Object> requestData) {
        try {
            Integer inputPassword = (Integer) requestData.get("password");
            boolean isValid = verifyMemberPassword(memberId, inputPassword);
            
            Map<String, Object> response = Map.of(
                "valid", isValid,
                "message", isValid ? "비밀번호가 확인되었습니다." : "비밀번호가 일치하지 않습니다."
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "비밀번호 검증 중 오류가 발생했습니다."));
        }
    }

    // 회원 정보 수정
    @PutMapping("/{memberId}")
    public ResponseEntity<?> updateMember(@PathVariable(name = "memberId") Long memberId,
                                         @RequestBody Map<String, Object> updateData) {
        try {
            // 실제 구현에서는 회원 업데이트 로직을 구현해야 합니다.
            // 지금은 예시로만 작성하였습니다.
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    // 회원 삭제
    @DeleteMapping("/phone/{phone}")
    public ResponseEntity<?> deleteMember(@PathVariable(name = "phone") String phone) {
        try {
            boolean deleted = deleteMemberByPhone(phone);
            if (deleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "회원 삭제 중 오류가 발생했습니다."));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // 회원 포인트 업데이트 (적립/차감)
    @PostMapping("/{memberId}/points")
    public ResponseEntity<?> updateMemberPoints(@PathVariable(name = "memberId") Long memberId,
                                              @RequestBody Map<String, Object> requestData) {
        try {
            Integer points = (Integer) requestData.get("points");
            String action = (String) requestData.get("action");
            
            System.out.println("포인트 업데이트 요청 - 회원ID: " + memberId + ", 포인트: " + points + ", 액션: " + action);
            
            if (points == null || points <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "유효한 포인트 값을 입력해주세요."));
            }
            
            if (action == null || (!action.equals("ADD") && !action.equals("DEDUCT"))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "유효한 액션을 입력해주세요. (ADD 또는 DEDUCT)"));
            }
            
            Optional<Member> memberOpt = findById(memberId);
            if (!memberOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "회원을 찾을 수 없습니다."));
            }
            
            Member member = memberOpt.get();
            int currentPoints = member.getPoints();
            int newPoints;
            
            System.out.println("현재 포인트: " + currentPoints);
            
            if (action.equals("ADD")) {
                newPoints = currentPoints + points;
            } else { // DEDUCT
                if (currentPoints < points) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("message", "잔여 포인트가 부족합니다."));
                }
                newPoints = currentPoints - points;
            }
            
            System.out.println("새로운 포인트: " + newPoints);
            
            // 포인트 업데이트
            boolean updated = updateMemberPoints(memberId, newPoints);
            
            System.out.println("포인트 업데이트 결과: " + updated);
            
            if (updated) {
                return ResponseEntity.ok(Map.of(
                    "message", action.equals("ADD") ? "포인트가 적립되었습니다." : "포인트가 차감되었습니다.",
                    "previousPoints", currentPoints,
                    "currentPoints", newPoints,
                    "pointsChanged", points
                ));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "포인트 업데이트 중 오류가 발생했습니다."));
            }
            
        } catch (Exception e) {
            System.err.println("포인트 업데이트 중 예외 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "서버 오류가 발생했습니다: " + e.getMessage()));
        }
    }


    // 휴대전화로 회원 검색
    // Optional로 Null 값 허용
    public Optional<Member> findByPhone(String phone){
        return memberRepository.findByPhone(phone);
    }

    // ID로 회원 검색
    public Optional<Member> findById(Long memberId) {
        return memberRepository.findById(memberId);
    }

    // Null일 때 예외처리
    public Member getMember(String phone){
        return memberRepository.findByPhone(phone).orElseThrow(() -> new IllegalArgumentException("Error: 미등록 회원 " + phone));
    }

    // 회원 가입
    public void saveMember(Member member){
        if (memberRepository.findByPhone(member.getPhone()).isPresent()) {
            throw new IllegalStateException("Error: 이미 등록된 회원 " + member.getPhone());
        }
        memberRepository.save(Member.builder()
                .name(member.getName())
                .phone(member.getPhone())
                .pw(member.getPw())
                .points(0)
                .build());
    }

    // 회원 삭제
    public boolean deleteMemberByPhone(String phone){
        memberRepository.delete(findByPhone(phone).orElseThrow(() -> new IllegalArgumentException("Error: 회원 탈퇴 중 오류 " + phone)));

        return memberRepository.findByPhone(phone).isEmpty();
    }

    // 회원 정보 수정
    // 더티 체킹 사용
    @Transactional
    public Member updateMember(UpdateMemberDto updateMemberDto){
        memberRepository.findByPhone(updateMemberDto.getBeforePhone())
                .orElseThrow(() -> new IllegalArgumentException("Error: 미등록 회원 " + updateMemberDto.getBeforePhone()))
                .updateMember(updateMemberDto);

        return memberRepository.findByPhone(updateMemberDto.getAfterPhone()).orElseThrow(()-> new IllegalArgumentException("Error: 회원 수정 중 오류 " + updateMemberDto.getAfterPhone()));
    }

    // 회원 비밀번호 검증
    public boolean verifyMemberPassword(Long memberId, Integer inputPassword) {
        Optional<Member> memberOpt = memberRepository.findById(memberId);
        if (memberOpt.isEmpty()) {
            throw new IllegalArgumentException("회원을 찾을 수 없습니다.");
        }

        Member member = memberOpt.get();
        // 비밀번호가 null이거나 입력값이 null인 경우 처리
        if (member.getPw() == null || inputPassword == null) {
            return false;
        }

        // 비밀번호 비교 (현재는 평문 비교, 추후 암호화 적용 필요)
        return member.getPw().equals(inputPassword);
    }

    // 회원 포인트 업데이트
    @Transactional
    public boolean updateMemberPoints(Long memberId, int newPoints) {
        try {
            System.out.println("MemberService - 포인트 업데이트 시작: 회원ID=" + memberId + ", 새포인트=" + newPoints);

            Optional<Member> memberOpt = memberRepository.findById(memberId);
            if (memberOpt.isEmpty()) {
                System.err.println("회원을 찾을 수 없습니다: " + memberId);
                throw new IllegalArgumentException("회원을 찾을 수 없습니다.");
            }

            Member member = memberOpt.get();
            System.out.println("업데이트 전 포인트: " + member.getPoints());

            member.updatePoints(newPoints);
            Member savedMember = memberRepository.save(member);

            System.out.println("업데이트 후 포인트: " + savedMember.getPoints());
            System.out.println("포인트 업데이트 성공!");

            return true;
        } catch (Exception e) {
            System.err.println("포인트 업데이트 실패: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}