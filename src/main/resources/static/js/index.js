// 시계 업데이트 함수
function updateClock() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${year}-${month}-${day}/${hours}:${minutes}:${seconds}`;
    document.getElementById('clock').textContent = timeString;
}

// 매출 UI 관련 함수
function showSalesUI() {
    document.querySelector('.overlay').style.display = 'block';
    document.querySelector('.sales-container').style.display = 'block';
}

// 메뉴 관리 모달 열기
function openMenuManageModal() {
    document.querySelector('.menuEntity-manage-overlay').style.display = 'block';
    document.querySelector('.menuEntity-manage-container').style.display = 'block';
    loadMenus();
    loadCategoriesForSelect();
}

// 메뉴 관리 모달 닫기
function closeMenuManageModal() {
    document.querySelector('.menuEntity-manage-overlay').style.display = 'none';
    document.querySelector('.menuEntity-manage-container').style.display = 'none';
}

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
                    <button onclick="editMenu(${menuEntity.id})">수정</button>
                    <button onclick="deleteMenu(${menuEntity.id})">삭제</button>
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

let currentCategory = null;

// 카테고리 버튼 클릭 이벤트 핸들러
function handleCategoryClick(event) {
    const category = event.target.dataset.category;
    if (!category) return; // 관리 버튼 등은 처리하지 않음
    
    currentCategory = category;
    loadMenuByCategory(category);
    
    // 카테고리 버튼 스타일 업데이트
    document.querySelectorAll('.category-button').forEach(button => {
        button.classList.remove('active');
    });
    event.target.classList.add('active');
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
                    menuItems[index].onclick = () => addToOrder(menuEntity);
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
                    menuItems[index].onclick = () => addToOrder(menuEntity);
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
                    menuItems[index].onclick = () => addToOrder(menuEntity);
                }
            });
        }
    }
}

// 주문에 메뉴 추가 함수
function addToOrder(menuEntity) {
    // TODO: 주문 목록에 메뉴 추가 구현
    console.log('메뉴 추가:', menuEntity);
}

// 카테고리 관리 함수들
function openCategoryManageModal() {
    document.querySelector('.category-manage-overlay').style.display = 'block';
    document.querySelector('.category-manage-container').style.display = 'block';
    loadCategories();
    loadCategoryTypes();
}

function closeCategoryManageModal() {
    document.querySelector('.category-manage-overlay').style.display = 'none';
    document.querySelector('.category-manage-container').style.display = 'none';
}

async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        
        const categoryTableBody = document.querySelector('.category-table tbody');
        categoryTableBody.innerHTML = '';
        
        categories.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.type}</td>
                <td>${category.name}</td>
                <td>${category.description || ''}</td>
                <td>${category.status}</td>
                <td>
                    <button onclick="editCategory(${category.id})">수정</button>
                    <button onclick="deleteCategory(${category.id})">삭제</button>
                </td>
            `;
            categoryTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('카테고리 로드 중 오류 발생:', error);
    }
}

async function loadCategoryTypes() {
    try {
        const response = await fetch('/api/categories/types');
        const types = await response.json();
        
        const typeSelect = document.querySelector('select[name="type"]');
        typeSelect.innerHTML = '<option value="">카테고리 타입 선택</option>';
        
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            typeSelect.appendChild(option);
        });
    } catch (error) {
        console.error('카테고리 타입 로드 중 오류 발생:', error);
    }
}

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

// 카테고리 추가/수정/삭제 함수들
async function addCategory(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const categoryData = {
        type: formData.get('type'),
        name: formData.get('name'),
        description: formData.get('description'),
        status: formData.get('status') === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'
    };

    try {
        const response = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryData)
        });

        if (!response.ok) throw new Error('카테고리 추가 실패');

        loadCategories();
        loadAndDisplayCategories(); // UI 업데이트
        event.target.reset();
    } catch (error) {
        console.error('카테고리 추가 중 오류 발생:', error);
    }
}

async function deleteCategory(id) {
    if (!confirm('이 카테고리를 삭제하시겠습니까?')) return;

    try {
        const response = await fetch(`/api/categories/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('카테고리 삭제 실패');

        loadCategories();
        loadAndDisplayCategories(); // UI 업데이트
    } catch (error) {
        console.error('카테고리 삭제 중 오류 발생:', error);
    }
}

async function editCategory(id) {
    try {
        const response = await fetch(`/api/categories/${id}`);
        const category = await response.json();
        
        // 수정 폼에 데이터 채우기
        document.querySelector('select[name="type"]').value = category.type;
        document.querySelector('input[name="name"]').value = category.name;
        document.querySelector('textarea[name="description"]').value = category.description || '';
        document.querySelector('input[name="status"]').checked = category.status === 'ACTIVE';
        
        // 폼의 동작을 수정 모드로 변경
        const form = document.querySelector('.category-form');
        form.onsubmit = (e) => updateCategory(e, id);
        
        // 버튼 텍스트 변경
        form.querySelector('button[type="submit"]').textContent = '카테고리 수정';
        
        // 취소 버튼 추가
        if (!form.querySelector('.cancel-btn')) {
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'cancel-btn';
            cancelBtn.textContent = '취소';
            cancelBtn.onclick = resetCategoryForm;
            form.appendChild(cancelBtn);
        }
    } catch (error) {
        console.error('카테고리 정보 로드 중 오류 발생:', error);
    }
}

async function updateCategory(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const categoryData = {
        type: formData.get('type'),
        name: formData.get('name'),
        description: formData.get('description'),
        status: formData.get('status') === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'
    };

    try {
        const response = await fetch(`/api/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryData)
        });

        if (!response.ok) throw new Error('카테고리 수정 실패');

        loadCategories();
        loadAndDisplayCategories(); // UI 업데이트
        resetCategoryForm();
    } catch (error) {
        console.error('카테고리 수정 중 오류 발생:', error);
    }
}

function resetCategoryForm() {
    const form = document.querySelector('.category-form');
    form.reset();
    form.onsubmit = addCategory;
    form.querySelector('button[type="submit"]').textContent = '카테고리 추가';
    const cancelBtn = form.querySelector('.cancel-btn');
    if (cancelBtn) {
        cancelBtn.remove();
    }
}

// 카테고리 로드 및 표시 함수
async function loadAndDisplayCategories() {
    const firstRow = document.querySelector('.category-row:first-child');
    const secondRow = document.querySelector('.category-row:last-child');
    
    // 이미 카테고리 버튼이 존재하는지 확인
    const existingButtons = firstRow.querySelectorAll('.category-button[data-category]');
    
    // 카테고리 버튼이 이미 존재하면 API 호출하지 않고 기존 버튼에 이벤트 리스너만 추가
    if (existingButtons.length > 0) {
        console.log('카테고리 버튼이 이미 존재합니다. 이벤트 리스너만 추가합니다.');
        
        // 모든 카테고리 버튼에 클릭 이벤트 리스너 추가
        document.querySelectorAll('.category-button[data-category]').forEach(button => {
            // 이벤트 리스너 중복 방지를 위해 기존 리스너 제거 후 추가
            button.removeEventListener('click', handleCategoryClick);
            button.addEventListener('click', handleCategoryClick);
        });
        
        // 첫 번째 카테고리 자동 선택
        const firstCategory = document.querySelector('.category-button[data-category]');
        if (firstCategory) {
            firstCategory.click();
        }
        return;
    }
    
    // 기본 카테고리와 관리 버튼을 유지 (페이지 초기 상태를 유지)
    const defaultCategories = [
        { type: 'COFFEE', name: '커피' },
        { type: 'DECAF', name: '디카페인' },
        { type: 'NON_COFFEE', name: '논커피/<br>과일라떼' },
        { type: 'TEA', name: '티' },
        { type: 'SMOOTHIE', name: '스무디<br>프라페' },
        { type: 'ADE', name: '에이드<br>주스' },
        { type: 'SEASON', name: '시즌메뉴' },
        { type: 'BREAD', name: '빵' }
    ];
    
    try {
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
            throw new Error('카테고리를 불러오는데 실패했습니다');
        }
        
        const categories = await response.json();
        
        // API에서 카테고리를 성공적으로 가져왔을 때만 기존 카테고리 버튼 초기화
        if (categories && categories.length > 0) {
            // 기존 카테고리 버튼 초기화 (관리 버튼 제외)
            firstRow.innerHTML = '';
            secondRow.innerHTML = '';
            
            // 첫 번째 줄에 6개, 두 번째 줄에 나머지 카테고리 배치
            categories.forEach((category, index) => {
                const button = document.createElement('div');
                button.className = 'category-button';
                button.dataset.category = category.type;
                button.dataset.categoryId = category.id;
                
                // 카테고리 이름이 긴 경우 줄바꿈 처리
                const displayName = category.name.length > 4 ? 
                    category.name.replace('/', '<br>') : category.name;
                button.innerHTML = displayName;
                
                button.addEventListener('click', handleCategoryClick);
                
                if (index < 6) {
                    firstRow.appendChild(button);
                } else if (index < 12) {
                    secondRow.appendChild(button);
                }
            });
            
            // 첫 번째 줄에 카테고리 관리 버튼 추가
            const categoryManageBtn = document.createElement('div');
            categoryManageBtn.className = 'category-button';
            categoryManageBtn.innerHTML = '카테고리<br>관리';
            categoryManageBtn.onclick = openCategoryManageModal;
            firstRow.appendChild(categoryManageBtn);
            
            // 두 번째 줄 남은 공간 채우기
            const remainingSlots = 6 - Math.max(0, categories.length - 6);
            for (let i = 0; i < remainingSlots; i++) {
                const emptyButton = document.createElement('div');
                emptyButton.className = 'category-button';
                secondRow.appendChild(emptyButton);
            }
            
            // 메뉴 관리 버튼 추가
            const menuManageBtn = document.createElement('div');
            menuManageBtn.className = 'category-button';
            menuManageBtn.innerHTML = '메뉴<br>관리';
            menuManageBtn.onclick = openMenuManageModal;
            secondRow.appendChild(menuManageBtn);
        } else {
            throw new Error('카테고리 데이터가 없습니다');
        }
    } catch (error) {
        console.error('카테고리 로드 중 오류 발생:', error);
        console.log('기본 카테고리를 표시합니다.');
        
        // 이미 정적 카테고리 버튼이 있는지 확인하고, 없을 경우만 생성
        if (!firstRow.querySelectorAll('.category-button[data-category]').length) {
            console.log('정적 카테고리 버튼을 생성합니다.');
            firstRow.innerHTML = '';
            
            // 첫 번째 줄 카테고리 (6개)
            defaultCategories.slice(0, 6).forEach(category => {
                const button = document.createElement('div');
                button.className = 'category-button';
                button.dataset.category = category.type;
                button.innerHTML = category.name;
                button.addEventListener('click', handleCategoryClick);
                firstRow.appendChild(button);
            });
            
            // 카테고리 관리 버튼 추가
            const categoryManageBtn = document.createElement('div');
            categoryManageBtn.className = 'category-button';
            categoryManageBtn.innerHTML = '카테고리<br>관리';
            categoryManageBtn.onclick = openCategoryManageModal;
            firstRow.appendChild(categoryManageBtn);
        }
        
        if (!secondRow.querySelectorAll('.category-button[data-category]').length) {
            secondRow.innerHTML = '';
            
            // 두 번째 줄 카테고리 (나머지)
            defaultCategories.slice(6).forEach(category => {
                const button = document.createElement('div');
                button.className = 'category-button';
                button.dataset.category = category.type;
                button.innerHTML = category.name;
                button.addEventListener('click', handleCategoryClick);
                secondRow.appendChild(button);
            });
            
            // 빈 버튼 채우기
            const remainingSlots = 6 - defaultCategories.slice(6).length;
            for (let i = 0; i < remainingSlots; i++) {
                const emptyButton = document.createElement('div');
                emptyButton.className = 'category-button';
                secondRow.appendChild(emptyButton);
            }
            
            // 메뉴 관리 버튼 추가
            const menuManageBtn = document.createElement('div');
            menuManageBtn.className = 'category-button';
            menuManageBtn.innerHTML = '메뉴<br>관리';
            menuManageBtn.onclick = openMenuManageModal;
            secondRow.appendChild(menuManageBtn);
        } else {
            // 기존 버튼에 이벤트 리스너 추가
            document.querySelectorAll('.category-button[data-category]').forEach(button => {
                button.removeEventListener('click', handleCategoryClick);
                button.addEventListener('click', handleCategoryClick);
            });
        }
    }
    
    // 첫 번째 카테고리 자동 선택
    const firstCategory = document.querySelector('.category-button[data-category]');
    if (firstCategory) {
        firstCategory.click();
    }
}

// 이벤트 리스너 및 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 시계 초기화 및 업데이트
    updateClock();
    setInterval(updateClock, 500);
    
    // 닫기 버튼 이벤트
    document.querySelector('.close-btn').addEventListener('click', function() {
        document.querySelector('.overlay').style.display = 'none';
        document.querySelector('.sales-container').style.display = 'none';
    });

    // 오버레이 클릭 시 닫기
    document.querySelector('.overlay').addEventListener('click', function() {
        document.querySelector('.overlay').style.display = 'none';
        document.querySelector('.sales-container').style.display = 'none';
    });

    // Sales 탭 전환 기능
    const salesTabs = document.querySelectorAll('.sales-tab');
    salesTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            salesTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 날짜 입력 시 자동 업데이트
    document.querySelector('.date-input').addEventListener('change', function(e) {
        // 여기에 날짜 변경 시 처리할 로직 추가(예정)
        console.log('Selected date:', e.target.value);
    });
    
    // 카테고리 버튼에 클릭 이벤트 리스너 추가
    document.querySelectorAll('.category-button').forEach(button => {
        button.addEventListener('click', handleCategoryClick);
    });
    
    // 카테고리 로드
    loadAndDisplayCategories();
}); 