import { optionPrices } from './common.js';

// 현재 옵션 선택 중인 메뉴
let currentOptionMenu = null;
let optionQuantity = 1;
let selectedOptions = {
    temperature: 'HOT',
    size: 'SMALL',
    syrup: 'NONE'
};

// 전역 변수로 주문 목록과 선택된 주문 항목 인덱스 관리
let orderItems = [];
let selectedOrderItemIndex = -1;

// 주문에 메뉴 추가 함수
function addToOrder(menuEntity) {
    openMenuOptionModal(menuEntity);
}

// 주문 목록 UI 업데이트 함수
function updateOrderList() {
    const orderListElement = document.querySelector('.order-list');
    orderListElement.innerHTML = '';
    
    orderItems.forEach((item, index) => {
        const orderItemElement = document.createElement('div');
        orderItemElement.className = 'order-item';
        if (index === selectedOrderItemIndex) {
            orderItemElement.classList.add('selected');
        }
        
        orderItemElement.innerHTML = `
            <div class="order-number">${index + 1}</div>
            <div class="order-name">${item.name}</div>
            <div class="order-quantity">${item.quantity}</div>
            <div class="order-price">${(item.price * item.quantity).toLocaleString()}원</div>
        `;
        
        // 클릭 시 선택 처리
        orderItemElement.addEventListener('click', () => {
            selectOrderItem(index);
        });
        
        orderListElement.appendChild(orderItemElement);
    });
    
    // 주문 수량 업데이트
    const orderQuantityElement = document.querySelector('.total-item:nth-child(4) div:last-child');
    const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    orderQuantityElement.textContent = totalQuantity;
}

// 주문 금액 업데이트 함수
function updateTotalAmount() {
    const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalAmountElement = document.querySelector('.total-item:nth-child(2) div:nth-child(2)');
    totalAmountElement.textContent = totalAmount.toLocaleString();
    
    // 청구금액도 동일하게 설정 (할인 등이 없는 경우)
    const totalBillingElement = document.querySelector('.total-item:nth-child(2) div:last-child');
    totalBillingElement.textContent = totalAmount.toLocaleString();
}

// 주문 항목 선택 함수
function selectOrderItem(index) {
    selectedOrderItemIndex = index;
    
    // 모든 주문 항목의 선택 클래스 제거
    document.querySelectorAll('.order-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // 선택된 항목에 선택 클래스 추가
    if (index >= 0 && index < orderItems.length) {
        document.querySelectorAll('.order-item')[index].classList.add('selected');
    }
}

// 수량 증가 함수
function increaseQuantity() {
    if (selectedOrderItemIndex >= 0 && selectedOrderItemIndex < orderItems.length) {
        orderItems[selectedOrderItemIndex].quantity += 1;
        updateOrderList();
        updateTotalAmount();
    }
}

// 수량 감소 함수
function decreaseQuantity() {
    if (selectedOrderItemIndex >= 0 && selectedOrderItemIndex < orderItems.length) {
        if (orderItems[selectedOrderItemIndex].quantity > 1) {
            orderItems[selectedOrderItemIndex].quantity -= 1;
        } else {
            // 수량이 1이면 항목 삭제
            orderItems.splice(selectedOrderItemIndex, 1);
            selectedOrderItemIndex = -1; // 선택 초기화
        }
        updateOrderList();
        updateTotalAmount();
    }
}

// 메뉴 옵션 모달 열기
function openMenuOptionModal(menuEntity) {
    // 현재 선택된 메뉴 저장
    currentOptionMenu = menuEntity;
    
    // 메뉴 정보 표시
    document.getElementById('selectedMenuName').textContent = menuEntity.name;
    document.getElementById('selectedMenuPrice').textContent = `${menuEntity.price}원`;
    
    // 옵션 수량 초기화
    optionQuantity = 1;
    document.getElementById('optionQuantity').textContent = optionQuantity;
    
    // 기본 옵션 선택
    selectedOptions = {
        temperature: 'HOT',  // 기본값
        size: 'SMALL',       // 기본값
        syrup: 'NONE'        // 기본값
    };
    
    // 옵션 버튼 선택 상태 초기화
    document.querySelectorAll('.option-button').forEach(button => {
        button.classList.remove('selected');
        
        // 기본 옵션에 selected 클래스 추가
        const optionType = button.dataset.optionType;
        const optionValue = button.dataset.optionValue;
        
        if (optionValue === selectedOptions[optionType]) {
            button.classList.add('selected');
        }
    });
    
    // 총 금액 계산 및 표시
    updateOptionTotalPrice();
    
    // 모달 표시
    document.querySelector('.menu-option-overlay').style.display = 'block';
    document.querySelector('.menu-option-container').style.display = 'block';
}

// 메뉴 옵션 모달 닫기
function closeMenuOptionModal() {
    document.querySelector('.menu-option-overlay').style.display = 'none';
    document.querySelector('.menu-option-container').style.display = 'none';
    currentOptionMenu = null;
}

// 옵션 수량 감소
function decreaseOptionQuantity() {
    if (optionQuantity > 1) {
        optionQuantity--;
        document.getElementById('optionQuantity').textContent = optionQuantity;
        updateOptionTotalPrice();
    }
}

// 옵션 수량 증가
function increaseOptionQuantity() {
    optionQuantity++;
    document.getElementById('optionQuantity').textContent = optionQuantity;
    updateOptionTotalPrice();
}

// 옵션 총 금액 계산 및 표시
function updateOptionTotalPrice() {
    if (!currentOptionMenu) return;
    
    const basePrice = currentOptionMenu.price;
    const sizePrice = optionPrices.size[selectedOptions.size];
    const syrupPrice = optionPrices.syrup[selectedOptions.syrup];
    
    const totalPrice = (basePrice + sizePrice + syrupPrice) * optionQuantity;
    document.getElementById('optionTotalPrice').textContent = `${totalPrice.toLocaleString()}원`;
}

// 옵션과 함께 주문에 추가
function addToOrderWithOptions() {
    if (!currentOptionMenu) return;
    
    // 옵션 텍스트 생성
    let optionText = '';
    
    // 온도 옵션 추가
    optionText += selectedOptions.temperature === 'HOT' ? ' (HOT)' : ' (ICED)';
    
    // 사이즈 옵션 추가
    if (selectedOptions.size !== 'SMALL') {
        optionText += `, ${selectedOptions.size}`;
    }
    
    // 시럽 옵션 추가
    if (selectedOptions.syrup !== 'NONE') {
        optionText += `, ${selectedOptions.syrup} 시럽`;
    }
    
    // 추가 가격 계산
    const sizePrice = optionPrices.size[selectedOptions.size];
    const syrupPrice = optionPrices.syrup[selectedOptions.syrup];
    const optionPrice = sizePrice + syrupPrice;
    
    // 메뉴 ID에 옵션 정보 추가하여 고유한 주문 항목으로 구분
    const orderItemId = `${currentOptionMenu.id}_${selectedOptions.temperature}_${selectedOptions.size}_${selectedOptions.syrup}`;
    
    // 같은 옵션의 메뉴가 이미 주문 목록에 있는지 확인
    const existingItemIndex = orderItems.findIndex(item => item.id === orderItemId);
    
    if (existingItemIndex !== -1) {
        // 이미 있으면 수량만 증가
        orderItems[existingItemIndex].quantity += optionQuantity;
    } else {
        // 새로운 항목 추가
        orderItems.push({
            id: orderItemId,
            menuId: currentOptionMenu.id,
            name: currentOptionMenu.name + optionText,
            price: currentOptionMenu.price + optionPrice,
            quantity: optionQuantity,
            options: {...selectedOptions}
        });
    }
    
    // 주문 목록 UI 업데이트
    updateOrderList();
    
    // 주문 금액 업데이트
    updateTotalAmount();
    
    // 옵션 모달 닫기
    closeMenuOptionModal();
}

// 주문 이벤트 리스너 초기화
function initOrderListeners() {
    // 증가/감소 버튼에 이벤트 리스너 추가
    document.querySelector('.operation-button:nth-child(4)').addEventListener('click', increaseQuantity);
    document.querySelector('.operation-button:nth-child(5)').addEventListener('click', decreaseQuantity);

    // 옵션 버튼 클릭 이벤트 설정
    document.querySelectorAll('.option-button').forEach(button => {
        button.addEventListener('click', function() {
            const optionType = this.dataset.optionType;
            const optionValue = this.dataset.optionValue;
            
            // 같은 타입의 다른 버튼들에서 선택 해제
            document.querySelectorAll(`.option-button[data-option-type="${optionType}"]`).forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // 현재 버튼 선택
            this.classList.add('selected');
            
            // 선택된 옵션 저장
            selectedOptions[optionType] = optionValue;
            
            // 총 금액 업데이트
            updateOptionTotalPrice();
        });
    });
}

export {
    orderItems,
    selectedOrderItemIndex,
    addToOrder,
    updateOrderList,
    updateTotalAmount,
    selectOrderItem,
    increaseQuantity,
    decreaseQuantity,
    openMenuOptionModal,
    closeMenuOptionModal,
    decreaseOptionQuantity,
    increaseOptionQuantity,
    updateOptionTotalPrice,
    addToOrderWithOptions,
    initOrderListeners
}; 