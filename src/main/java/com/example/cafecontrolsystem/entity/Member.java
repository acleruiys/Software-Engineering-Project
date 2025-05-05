package com.example.cafecontrolsystem.entity;

import com.example.cafecontrolsystem.dto.UpdateMemberDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "member")
@Getter @Setter
public class Member {
    @Id
    @Column(name = "member_id")
    private Long memberId;
    
    private String name;
    
    private String phone;
    
    private Integer points;
    
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<PointHistory> pointHistories = new ArrayList<>();

    public void updateMember(UpdateMemberDto updateMemberDto){
        this.phone = updateMemberDto.getAfterPhone();
        this.name = updateMemberDto.getName();
    }

    public void accumulatePoint(Integer point){
        this.points = this.points + point;
    }

    public void usePoint(Integer point){
        this.points = this.points - point;
    }



} 