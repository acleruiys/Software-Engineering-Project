package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.entity.Member;
import com.example.cafecontrolsystem.service.MemberService;
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

    private final MemberService memberService;

    // 모든 회원 목록 조회
    @GetMapping
    public ResponseEntity<List<Member>> getAllMembers() {
        List<Member> members = memberService.getAllMembers();
        return ResponseEntity.ok(members);
    }

    // 휴대폰 번호로 회원 검색
    @GetMapping("/phone/{phone}")
    public ResponseEntity<?> getMemberByPhone(@PathVariable String phone) {
        Optional<Member> member = memberService.findByPhone(phone);
        if (member.isPresent()) {
            return ResponseEntity.ok(member.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "회원을 찾을 수 없습니다."));
        }
    }

    // 회원 등록
    @PostMapping
    public ResponseEntity<?> registerMember(@RequestBody Member member) {
        try {
            memberService.saveMember(member);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // 회원 정보 수정
    @PutMapping("/{memberId}")
    public ResponseEntity<?> updateMember(@PathVariable Long memberId, 
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
    public ResponseEntity<?> deleteMember(@PathVariable String phone) {
        try {
            boolean deleted = memberService.deleteMember(phone);
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
}