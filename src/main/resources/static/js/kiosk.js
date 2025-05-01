// 카트 데이터
let cartItems = [];
let currentItem = null;
let categories = [];
let menuData = {};

// DOM 요소 가져오기
const categoryNav = document.getElementById('category-nav');
const menuGrid = document.getElementById('menu-grid');
const cartItemsContainer = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal');
const discountElement = document.getElementById('discount');
const totalElement = document.getElementById('total');
const cartCountElement = document.getElementById('cart-count');
const cancelOrderButton = document.getElementById('cancel-order');
const payOrderButton = document.getElementById('pay-order');
const optionsModal = document.getElementById('options-modal');
const modalItemName = document.getElementById('modal-item-name');
const closeModalButton = document.getElementById('close-modal');
const addToCartButton = document.getElementById('add-to-cart');

// API에서 카테고리 로드
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
            throw new Error('카테고리를 로드하는 중 오류가 발생했습니다.');
        }
        categories = await response.json();
        renderCategories();
        // 첫 번째 카테고리가 있으면 선택
        if (categories.length > 0) {
            const firstCategory = categories[0];
            if (firstCategory.type) {
                loadMenuByCategory(firstCategory.type);
                // 첫 번째 카테고리 버튼 활성화
                const firstCategoryBtn = document.querySelector(`[data-category="${firstCategory.type}"]`);
                if (firstCategoryBtn) {
                    firstCategoryBtn.classList.add('active');
                }
            }
        }
    } catch (error) {
        console.error('카테고리 로드 오류:', error);
        // 오류 발생시 샘플 데이터로 대체하여 UI 유지
        useSampleCategories();
    }
}

// 카테고리를 화면에 렌더링
function renderCategories() {
    categoryNav.innerHTML = '';
    categories.forEach(category => {
        if (category.status === 'ACTIVE') {
            const button = document.createElement('button');
            button.className = 'category-button';
            button.dataset.category = category.type;
            button.textContent = category.name;
            button.addEventListener('click', handleCategoryClick);
            categoryNav.appendChild(button);
        }
    });
}

// API에서 특정 카테고리의 메뉴 로드
async function loadMenuByCategory(categoryType) {
    try {
        const response = await fetch(`/api/menus?category=${categoryType}`);
        if (!response.ok) {
            throw new Error('메뉴를 로드하는 중 오류가 발생했습니다.');
        }
        const menus = await response.json();
        menuData[categoryType] = menus;
        displayMenuItems(categoryType);
    } catch (error) {
        console.error('메뉴 로드 오류:', error);
        // 오류 발생시 샘플 데이터로 대체하여 UI 유지
        useSampleMenuData(categoryType);
    }
}

// 샘플 카테고리 데이터 사용 (API 실패 시)
function useSampleCategories() {
    categories = [
        { type: 'COFFEE', name: '커피', status: 'ACTIVE' },
        { type: 'NON_COFFEE', name: '논커피', status: 'ACTIVE' },
        { type: 'TEA', name: '차', status: 'ACTIVE' },
        { type: 'ADE', name: '에이드', status: 'ACTIVE' },
        { type: 'SMOOTHIE', name: '스무디', status: 'ACTIVE' },
        { type: 'DESSERT', name: '디저트', status: 'ACTIVE' }
    ];
    renderCategories();
    // 첫 번째 카테고리 선택
    if (categories.length > 0) {
        loadMenuByCategory(categories[0].type);
        const firstCategoryBtn = document.querySelector(`[data-category="${categories[0].type}"]`);
        if (firstCategoryBtn) {
            firstCategoryBtn.classList.add('active');
        }
    }
}

// 샘플 메뉴 데이터 사용 (API 실패 시)
function useSampleMenuData(categoryType) {
    const sampleData = {
        'COFFEE': [
            { id: 1, name: '아메리카노', price: 4500, image: 'https://via.placeholder.com/150?text=아메리카노' },
            { id: 2, name: '카페라떼', price: 5000, image: 'https://via.placeholder.com/150?text=카페라떼' },
            { id: 3, name: '바닐라라떼', price: 5500, image: 'https://via.placeholder.com/150?text=바닐라라떼' },
            { id: 4, name: '카라멜 마키아또', price: 5800, image: 'https://via.placeholder.com/150?text=카라멜마키아또' },
            { id: 5, name: '에스프레소', price: 4000, image: 'https://via.placeholder.com/150?text=에스프레소' },
            { id: 6, name: '콜드브루', price: 5500, image: 'https://via.placeholder.com/150?text=콜드브루' }
        ],
        'NON_COFFEE': [
            { id: 7, name: '초코라떼', price: 5500, image: 'https://via.placeholder.com/150?text=초코라떼' },
            { id: 8, name: '녹차라떼', price: 5500, image: 'https://via.placeholder.com/150?text=녹차라떼' },
            { id: 9, name: '고구마라떼', price: 5800, image: 'https://via.placeholder.com/150?text=고구마라떼' }
        ],
        'TEA': [
            { id: 10, name: '얼그레이', price: 4500, image: 'https://via.placeholder.com/150?text=얼그레이' },
            { id: 11, name: '캐모마일', price: 4500, image: 'https://via.placeholder.com/150?text=캐모마일' },
            { id: 12, name: '페퍼민트', price: 4500, image: 'https://via.placeholder.com/150?text=페퍼민트' }
        ],
        'ADE': [
            { id: 13, name: '레몬에이드', price: 6000, image: 'https://via.placeholder.com/150?text=레몬에이드' },
            { id: 14, name: '자몽에이드', price: 6000, image: 'https://via.placeholder.com/150?text=자몽에이드' },
            { id: 15, name: '청포도에이드', price: 6000, image: 'https://via.placeholder.com/150?text=청포도에이드' }
        ],
        'SMOOTHIE': [
            { id: 16, name: '딸기 스무디', price: 6500, image: 'https://via.placeholder.com/150?text=딸기스무디' },
            { id: 17, name: '망고 스무디', price: 6500, image: 'https://via.placeholder.com/150?text=망고스무디' },
            { id: 18, name: '블루베리 스무디', price: 6500, image: 'https://via.placeholder.com/150?text=블루베리스무디' }
        ],
        'DESSERT': [
            { id: 19, name: '크로플', price: 4500, image: 'https://via.placeholder.com/150?text=크로플' },
            { id: 20, name: '치즈케이크', price: 5500, image: 'https://via.placeholder.com/150?text=치즈케이크' },
            { id: 21, name: '티라미수', price: 5500, image: 'https://via.placeholder.com/150?text=티라미수' }
        ]
    };

    // 요청한 카테고리의 샘플 데이터가 있으면 사용
    if (sampleData[categoryType]) {
        menuData[categoryType] = sampleData[categoryType];
        displayMenuItems(categoryType);
    } else {
        // 없으면 첫 번째 카테고리의 데이터 사용
        const firstCategory = Object.keys(sampleData)[0];
        menuData[categoryType] = sampleData[firstCategory];
        displayMenuItems(categoryType);
    }
}

// 카테고리 버튼 클릭 이벤트 핸들러
function handleCategoryClick(e) {
    // 활성화된 버튼 변경
    document.querySelectorAll('.category-button').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');

    // 해당 카테고리의 메뉴 표시
    const category = e.target.dataset.category;
    if (menuData[category]) {
        // 이미 로드된 메뉴 데이터가 있으면 바로 표시
        displayMenuItems(category);
    } else {
        // 아직 로드되지 않은 메뉴는 API에서 로드
        loadMenuByCategory(category);
    }
}

// 메뉴 아이템 표시 함수
function displayMenuItems(category) {
    menuGrid.innerHTML = '';
    
    if (menuData[category]) {
        menuData[category].forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            
            // 이미지 URL이 있으면 사용, 없으면 플레이스홀더 사용
            const imageUrl = item.imageUrl || `https://via.placeholder.com/150?text=${encodeURIComponent(item.name)}`;
            
            menuItem.innerHTML = `
                <div class="menu-image" style="background-image: url('${imageUrl}')"></div>
                <div class="menu-details">
                    <div class="menu-name">${item.name}</div>
                    <div class="menu-price">${formatPrice(item.price)}</div>
                </div>
            `;
            menuItem.addEventListener('click', () => openOptionsModal(item));
            menuGrid.appendChild(menuItem);
        });
    }
}

// 옵션 모달 열기
function openOptionsModal(item) {
    currentItem = item;
    modalItemName.textContent = item.name;
    optionsModal.style.display = 'flex';
}

// 모달 닫기
closeModalButton.addEventListener('click', () => {
    optionsModal.style.display = 'none';
});

// 외부 클릭 시 모달 닫기
optionsModal.addEventListener('click', (e) => {
    if (e.target === optionsModal) {
        optionsModal.style.display = 'none';
    }
});

// 장바구니에 추가
addToCartButton.addEventListener('click', () => {
    if (!currentItem) return;

    // 옵션 수집
    const size = document.querySelector('input[name="size"]:checked').value;
    const temperature = document.querySelector('input[name="temperature"]:checked').value;
    const extras = Array.from(document.querySelectorAll('input[name="extras"]:checked'))
        .map(input => input.value);

    // 추가 금액 계산
    let additionalPrice = 0;
    if (size === 'medium') additionalPrice += 500;
    if (size === 'large') additionalPrice += 1000;
    extras.forEach(extra => {
        if (extra === 'shot') additionalPrice += 500;
        if (extra === 'syrup') additionalPrice += 300;
        if (extra === 'whipped') additionalPrice += 500;
    });

    // 카트 아이템 생성
    const cartItem = {
        id: Date.now(), // 고유 식별자
        item: currentItem,
        quantity: 1,
        size,
        temperature,
        extras,
        additionalPrice,
        totalPrice: currentItem.price + additionalPrice
    };

    // 카트에 추가
    cartItems.push(cartItem);
    
    // UI 업데이트
    updateCartUI();
    optionsModal.style.display = 'none';
});

// 카트 UI 업데이트
function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">장바구니가 비어있습니다.</div>';
    } else {
        cartItems.forEach(cartItem => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            
            // 옵션 텍스트 생성
            const sizeText = cartItem.size === 'small' ? '스몰' : 
                            cartItem.size === 'medium' ? '미디움' : '라지';
            const tempText = cartItem.temperature === 'hot' ? '뜨거운 음료' : '차가운 음료';
            let extrasText = '';
            if (cartItem.extras.length > 0) {
                const extraNames = cartItem.extras.map(extra => {
                    if (extra === 'shot') return '샷 추가';
                    if (extra === 'syrup') return '시럽 추가';
                    if (extra === 'whipped') return '휘핑크림 추가';
                    return extra;
                });
                extrasText = `, ${extraNames.join(', ')}`;
            }
            
            itemElement.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${cartItem.item.name}</div>
                    <div class="item-options">${sizeText}, ${tempText}${extrasText}</div>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn decrease" data-id="${cartItem.id}">-</button>
                    <span class="quantity">${cartItem.quantity}</span>
                    <button class="quantity-btn increase" data-id="${cartItem.id}">+</button>
                </div>
                <div class="item-price">${formatPrice(cartItem.totalPrice * cartItem.quantity)}</div>
                <button class="quantity-btn remove" data-id="${cartItem.id}">×</button>
            `;
            
            cartItemsContainer.appendChild(itemElement);
        });
    }
    
    // 카트 카운트 업데이트
    cartCountElement.textContent = `${cartItems.length}개 항목`;
    
    // 금액 업데이트
    updateTotals();
    
    // 수량 버튼 이벤트 설정
    document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            decreaseQuantity(id);
        });
    });
    
    document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            increaseQuantity(id);
        });
    });
    
    document.querySelectorAll('.quantity-btn.remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            removeCartItem(id);
        });
    });
}

// 수량 감소
function decreaseQuantity(id) {
    const index = cartItems.findIndex(item => item.id === id);
    if (index !== -1) {
        if (cartItems[index].quantity > 1) {
            cartItems[index].quantity--;
            updateCartUI();
        } else {
            removeCartItem(id);
        }
    }
}

// 수량 증가
function increaseQuantity(id) {
    const index = cartItems.findIndex(item => item.id === id);
    if (index !== -1) {
        cartItems[index].quantity++;
        updateCartUI();
    }
}

// 카트 아이템 제거
function removeCartItem(id) {
    cartItems = cartItems.filter(item => item.id !== id);
    updateCartUI();
}

// 총액 업데이트
function updateTotals() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
    const discount = 0; // 할인 로직이 필요하면 여기에 추가
    const total = subtotal - discount;
    
    subtotalElement.textContent = formatPrice(subtotal);
    discountElement.textContent = formatPrice(discount);
    totalElement.textContent = formatPrice(total);
}

// 가격 포맷팅 함수
function formatPrice(price) {
    return `${price.toLocaleString()}원`;
}

// 주문 취소
cancelOrderButton.addEventListener('click', () => {
    if (cartItems.length > 0 && confirm('정말 주문을 취소하시겠습니까?')) {
        cartItems = [];
        updateCartUI();
    }
});

// 결제하기
payOrderButton.addEventListener('click', () => {
    if (cartItems.length === 0) {
        alert('장바구니가 비어있습니다.');
        return;
    }
    
    const total = cartItems.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
    alert(`총 ${formatPrice(total)}을 결제합니다.`);
    
    // 결제 완료 후 장바구니 비우기
    cartItems = [];
    updateCartUI();
});

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // API에서 카테고리 정보 로드
    loadCategories();
}); 