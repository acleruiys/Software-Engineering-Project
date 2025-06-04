package com.example.cafecontrolsystem.repository;

import com.example.cafecontrolsystem.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    public Optional<Member> findByPhone(String phone);
}
