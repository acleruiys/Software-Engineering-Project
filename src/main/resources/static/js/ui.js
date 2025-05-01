// 매출 UI 관련 함수
function showSalesUI() {
    document.querySelector('.overlay').style.display = 'block';
    document.querySelector('.sales-container').style.display = 'block';
}

// 관리 UI 관련 함수
function showManageUI() {
    document.querySelector('.manage-overlay').style.display = 'block';
    document.querySelector('.manage-container').style.display = 'block';
}

function closeManageUI() {
    document.querySelector('.manage-overlay').style.display = 'none';
    document.querySelector('.manage-container').style.display = 'none';
}

// 메뉴 관리 모달 열기
function openMenuManageModal() {
    document.querySelector('.menuEntity-manage-overlay').style.display = 'block';
    document.querySelector('.menuEntity-manage-container').style.display = 'block';
    
    // menu.js에서 export한 함수 호출
    window.loadMenus();
    window.loadCategoriesForSelect();
}

// 메뉴 관리 모달 닫기
function closeMenuManageModal() {
    document.querySelector('.menuEntity-manage-overlay').style.display = 'none';
    document.querySelector('.menuEntity-manage-container').style.display = 'none';
}

// 카테고리 관리 모달 열기/닫기
function openCategoryManageModal() {
    document.querySelector('.category-manage-overlay').style.display = 'block';
    document.querySelector('.category-manage-container').style.display = 'block';
    
    // category.js에서 export한 함수 호출
    window.loadCategories();
    window.loadCategoryTypes();
}

function closeCategoryManageModal() {
    document.querySelector('.category-manage-overlay').style.display = 'none';
    document.querySelector('.category-manage-container').style.display = 'none';
}

// UI 이벤트 리스너 초기화
function initUIListeners() {
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

    // 관리 UI 오버레이 클릭 시 닫기
    document.querySelector('.manage-overlay').addEventListener('click', function() {
        document.querySelector('.manage-overlay').style.display = 'none';
        document.querySelector('.manage-container').style.display = 'none';
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
        console.log('Selected date:', e.target.value);
    });
    
    // 메뉴 옵션 오버레이 클릭 시 닫기
    document.querySelector('.menu-option-overlay').addEventListener('click', function() {
        window.closeMenuOptionModal();
    });
}

export { 
    showSalesUI, 
    showManageUI, 
    closeManageUI, 
    openMenuManageModal, 
    closeMenuManageModal, 
    openCategoryManageModal, 
    closeCategoryManageModal,
    initUIListeners
}; 