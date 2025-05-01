// 메뉴 로드 함수 - API 연동
async function loadMenus() {
    try {
        const response = await fetch('/api/menus');
        const menus = await response.json();
        
        const menuTableBody = document.querySelector('.menuEntity-table tbody');
        menuTableBody.innerHTML = '';
        
        menus.forEach(menuEntity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${menuEntity.name}</td>
                <td>${menuEntity.price}원</td>
                <td>${menuEntity.category.name}</td>
                <td>${menuEntity.description || ''}</td>
                <td>${menuEntity.available ? '판매중' : '판매중지'}</td>
                <td>
                    <button onclick="window.editMenu(${menuEntity.id})">수정</button>
                    <button onclick="window.deleteMenu(${menuEntity.id})">삭제</button>
                </td>
            `;
            menuTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('메뉴 로드 중 오류 발생:', error);
    }
}

// 메뉴 추가 함수
async function addMenu(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const menuData = {
        name: formData.get('name'),
        price: parseInt(formData.get('price')),
        category: { id: parseInt(formData.get('category')) },
        description: formData.get('description'),
        available: formData.get('available') === 'true'
    };

    try {
        const response = await fetch('/api/menus', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(menuData)
        });

        if (!response.ok) throw new Error('메뉴 추가 실패');

        loadMenus();
        event.target.reset();
    } catch (error) {
        console.error('메뉴 추가 중 오류 발생:', error);
    }
}

// 메뉴 수정 함수
async function editMenu(menuId) {
    try {
        const response = await fetch(`/api/menus/${menuId}`);
        const menuEntity = await response.json();
        
        // 수정 폼에 데이터 채우기
        document.getElementById('editMenuId').value = menuEntity.id;
        document.getElementById('editMenuName').value = menuEntity.name;
        document.getElementById('editMenuPrice').value = menuEntity.price;
        document.getElementById('editMenuDescription').value = menuEntity.description;
        document.getElementById('editMenuAvailable').checked = menuEntity.available;
        
        // 수정 모달 열기
        document.querySelector('.menuEntity-edit-modal').style.display = 'block';
    } catch (error) {
        console.error('메뉴 정보 로드 중 오류 발생:', error);
    }
}

// 메뉴 삭제 함수
async function deleteMenu(menuId) {
    if (!confirm('메뉴를 삭제하시겠습니까?')) {
        return;
    }

    try {
        const response = await fetch(`/api/menus/${menuId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('메뉴 삭제 실패');
        }

        loadMenus();
    } catch (error) {
        console.error('메뉴 삭제 중 오류 발생:', error);
    }
}

// 메뉴 수정 제출 함수
async function submitMenuEdit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const menuId = formData.get('id');
    const menuData = {
        name: formData.get('name'),
        price: parseInt(formData.get('price')),
        description: formData.get('description'),
        available: formData.get('available') === 'true'
    };

    try {
        const response = await fetch(`/api/menus/${menuId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(menuData)
        });

        if (!response.ok) {
            throw new Error('메뉴 수정 실패');
        }

        loadMenus();
        document.querySelector('.menuEntity-edit-modal').style.display = 'none';
    } catch (error) {
        console.error('메뉴 수정 중 오류 발생:', error);
    }
}

// 카테고리별 메뉴 로드 함수
async function loadMenuByCategory(category) {
    // 모든 메뉴 아이템 초기화
    const menuItems = document.querySelectorAll('.menuEntity-item');
    menuItems.forEach(item => {
        item.innerHTML = '';
        item.style.cursor = 'default';
    });
    
    // 정적 메뉴 데이터 (API 호출 실패 시 사용)
    const staticMenus = {
        'COFFEE': [
            { id: 1, name: '아메리카노', price: 4500 },
            { id: 2, name: '카페라떼', price: 5000 },
            { id: 3, name: '바닐라라떼', price: 5500 },
            { id: 4, name: '카라멜 마키아또', price: 5800 },
            { id: 5, name: '에스프레소', price: 4000 },
            { id: 6, name: '콜드브루', price: 5500 }
        ],
        'DECAF': [
            { id: 7, name: '디카페인 아메리카노', price: 5000 },
            { id: 8, name: '디카페인 라떼', price: 5500 }
        ],
        'NON_COFFEE': [
            { id: 9, name: '초코라떼', price: 5500 },
            { id: 10, name: '녹차라떼', price: 5500 },
            { id: 11, name: '고구마라떼', price: 5800 }
        ],
        'TEA': [
            { id: 12, name: '얼그레이', price: 4500 },
            { id: 13, name: '캐모마일', price: 4500 },
            { id: 14, name: '페퍼민트', price: 4500 }
        ],
        'SMOOTHIE': [
            { id: 15, name: '딸기 스무디', price: 6500 },
            { id: 16, name: '망고 스무디', price: 6500 },
            { id: 17, name: '블루베리 스무디', price: 6500 }
        ],
        'ADE': [
            { id: 18, name: '레몬에이드', price: 6000 },
            { id: 19, name: '자몽에이드', price: 6000 },
            { id: 20, name: '청포도에이드', price: 6000 }
        ],
        'SEASON': [
            { id: 21, name: '시즌 스페셜', price: 6500 }
        ],
        'BREAD': [
            { id: 22, name: '크로플', price: 4500 },
            { id: 23, name: '치즈케이크', price: 5500 },
            { id: 24, name: '티라미수', price: 5500 }
        ]
    };
    
    try {
        const response = await fetch(`/api/menus?category=${category}`);
        
        if (!response.ok) {
            throw new Error('메뉴를 로드하는 중 오류가 발생했습니다');
        }
        
        const menus = await response.json();
        
        if (menus && menus.length > 0) {
            // 받아온 메뉴 데이터로 메뉴 아이템 업데이트
            menus.forEach((menuEntity, index) => {
                if (index < menuItems.length) {
                    menuItems[index].innerHTML = `
                        <div>${menuEntity.name}</div>
                        <div>${menuEntity.price}원</div>
                    `;
                    menuItems[index].style.cursor = 'pointer';
                    menuItems[index].onclick = () => window.openMenuOptionModal(menuEntity);
                }
            });
        } else {
            throw new Error('메뉴 데이터가 없습니다');
        }
    } catch (error) {
        console.error('메뉴 로드 중 오류 발생:', error);
        console.log('정적 메뉴 데이터를 사용합니다.');
        
        // API 실패 시 정적 데이터 사용
        if (staticMenus[category]) {
            staticMenus[category].forEach((menuEntity, index) => {
                if (index < menuItems.length) {
                    menuItems[index].innerHTML = `
                        <div>${menuEntity.name}</div>
                        <div>${menuEntity.price}원</div>
                    `;
                    menuItems[index].style.cursor = 'pointer';
                    menuItems[index].onclick = () => window.openMenuOptionModal(menuEntity);
                }
            });
        } else {
            // 해당 카테고리에 대한 정적 데이터가 없는 경우 첫 번째 카테고리 데이터 사용
            const firstCategory = Object.keys(staticMenus)[0];
            staticMenus[firstCategory].forEach((menuEntity, index) => {
                if (index < menuItems.length) {
                    menuItems[index].innerHTML = `
                        <div>${menuEntity.name}</div>
                        <div>${menuEntity.price}원</div>
                    `;
                    menuItems[index].style.cursor = 'pointer';
                    menuItems[index].onclick = () => window.openMenuOptionModal(menuEntity);
                }
            });
        }
    }
}

// 카테고리 선택 시 메뉴 목록 로드를 위한 함수
async function loadCategoriesForSelect() {
    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        
        const categorySelect = document.querySelector('select[name="category"]');
        categorySelect.innerHTML = '<option value="">카테고리 선택</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('카테고리 로드 중 오류 발생:', error);
    }
}

export { 
    loadMenus, 
    addMenu, 
    editMenu, 
    deleteMenu, 
    submitMenuEdit, 
    loadMenuByCategory, 
    loadCategoriesForSelect 
}; 