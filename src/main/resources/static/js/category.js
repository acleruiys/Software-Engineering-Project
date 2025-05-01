let currentCategory = null;

// 카테고리 버튼 클릭 이벤트 핸들러
function handleCategoryClick(event) {
    const category = event.target.dataset.category;
    if (!category) return; // 관리 버튼 등은 처리하지 않음
    
    currentCategory = category;
    window.loadMenuByCategory(category);
    
    // 카테고리 버튼 스타일 업데이트
    document.querySelectorAll('.category-button').forEach(button => {
        button.classList.remove('active');
    });
    event.target.classList.add('active');
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
            categoryManageBtn.onclick = window.openCategoryManageModal;
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
            menuManageBtn.onclick = window.openMenuManageModal;
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
            categoryManageBtn.onclick = window.openCategoryManageModal;
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
            menuManageBtn.onclick = window.openMenuManageModal;
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

// 카테고리 CRUD 함수들
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
                    <button onclick="window.editCategory(${category.id})">수정</button>
                    <button onclick="window.deleteCategory(${category.id})">삭제</button>
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

export { 
    currentCategory,
    handleCategoryClick, 
    loadAndDisplayCategories, 
    loadCategories, 
    loadCategoryTypes, 
    addCategory, 
    deleteCategory, 
    editCategory, 
    updateCategory, 
    resetCategoryForm 
}; 