package com.example.cafecontrolsystem.controller;

import com.example.cafecontrolsystem.entity.MenuOption;
import com.example.cafecontrolsystem.repository.OptionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/options")
public class OptionController {
    private final OptionRepository optionRepository;

    // 옵션 추가 -> default available = true
    public void saveOption(MenuOption menuOption){
        optionRepository.save(MenuOption.builder()
                .name(menuOption.getName())
                .price(menuOption.getPrice())
                .available(true)
                .build());
    }

    //옵션 삭제
    public Boolean deleteOption(Long optionId){
        optionRepository.deleteById(optionId);

        return optionRepository.findById(optionId).isEmpty();
    }

    @Transactional
    public void changeAvailable(Long id){
        optionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Error: 미등록 옵션 " + id))
                .changeAvailable();
    }

    @Transactional
    public void changeOptionPrice(Long id, Integer price){
        optionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Error: 미등록 옵션 " + id))
                .changeOptionPrice(price);
    }

    // 옵션 조회 -> Available is true
    public List<MenuOption> showOptionAvailableTrue(){
        return optionRepository.findByAvailableTrue();
    }

    // 옵션 전체 조회
    public List<MenuOption> showOptions(){
        return optionRepository.findAll();
    }
}
