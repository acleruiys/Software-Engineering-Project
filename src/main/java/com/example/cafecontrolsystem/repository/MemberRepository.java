package com.example.cafecontrolsystem.repository;

import com.example.cafecontrolsystem.entity.CategoryType;
import com.example.cafecontrolsystem.entity.Member;
import com.example.cafecontrolsystem.entity.Menu_entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    public Optional<Member> findByPhone(String phone);
}
