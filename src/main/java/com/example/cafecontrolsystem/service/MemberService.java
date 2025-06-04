package com.example.cafecontrolsystem.service;

import com.example.cafecontrolsystem.dto.UpdateMemberDto;
import com.example.cafecontrolsystem.entity.Member;
import com.example.cafecontrolsystem.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    // 모든 회원 목록 조회
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
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
    public boolean deleteMember(String phone){
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

}
