package com.example.cafecontrolsystem.entity;

import com.example.cafecontrolsystem.dto.UpdateMemberDto;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.boot.autoconfigure.web.WebProperties;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "member")
@Getter @Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long memberId;

    private String name;

    @Column(unique = true)
    private String phone;

    private Integer pw;

    private Integer points;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<PointHistory> pointHistories = new ArrayList<>();

    // 더티 체킹 시 사용
    public void updateMember(UpdateMemberDto updateMemberDto){
        this.phone = updateMemberDto.getAfterPhone();
        this.name = updateMemberDto.getName();
    }

    // 포인트 적립
    public void accumulatePoint(Integer point){
        this.points = this.points + point;
    }

    // 포인트 사용
    public void usePoint(Integer point){
        this.points = this.points - point;
    }

    // 포인트 업데이트 (직접 설정)
    public void updatePoints(int newPoints) {
        this.points = newPoints;
    }

} 