import { updateClock } from './common.js';
import { 
    showSalesUI, 
    showManageUI, 
    closeManageUI, 
    openMenuManageModal, 
    closeMenuManageModal, 
    openCategoryManageModal, 
    closeCategoryManageModal, 
    initUIListeners 
} from './ui.js';
import { 
    loadAndDisplayCategories, 
    handleCategoryClick, 
    loadCategories, 
    loadCategoryTypes, 
    addCategory, 
    deleteCategory, 
    editCategory, 
    updateCategory, 
    resetCategoryForm 
} from './category.js';
import { 
    loadMenus, 
    addMenu, 
    editMenu, 
    deleteMenu, 
    submitMenuEdit, 
    loadMenuByCategory, 
    loadCategoriesForSelect 
} from './menu.js';
import {
    openMenuOptionModal,
    closeMenuOptionModal,
    addToOrderWithOptions,
    decreaseOptionQuantity,
    increaseOptionQuantity,
    updateOptionTotalPrice,
    initOrderListeners
} from './order.js';

// 전역 함수 등록
window.showSalesUI = showSalesUI;
window.showManageUI = showManageUI;
window.closeManageUI = closeManageUI;
window.openMenuManageModal = openMenuManageModal;
window.closeMenuManageModal = closeMenuManageModal;
window.openCategoryManageModal = openCategoryManageModal;
window.closeCategoryManageModal = closeCategoryManageModal;

window.loadMenus = loadMenus;
window.addMenu = addMenu;
window.editMenu = editMenu;
window.deleteMenu = deleteMenu;
window.submitMenuEdit = submitMenuEdit;
window.loadMenuByCategory = loadMenuByCategory;
window.loadCategoriesForSelect = loadCategoriesForSelect;

window.loadCategories = loadCategories;
window.loadCategoryTypes = loadCategoryTypes;
window.addCategory = addCategory;
window.deleteCategory = deleteCategory;
window.editCategory = editCategory;
window.updateCategory = updateCategory;
window.resetCategoryForm = resetCategoryForm;

window.openMenuOptionModal = openMenuOptionModal;
window.closeMenuOptionModal = closeMenuOptionModal;
window.addToOrderWithOptions = addToOrderWithOptions;
window.decreaseOptionQuantity = decreaseOptionQuantity;
window.increaseOptionQuantity = increaseOptionQuantity;

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 시계 초기화 및 업데이트
    updateClock();
    setInterval(updateClock, 500);
    
    // UI 이벤트 리스너 초기화
    initUIListeners();
    
    // 카테고리 로드 및 이벤트 리스너 초기화
    loadAndDisplayCategories();
    
    // 주문 관련 이벤트 리스너 초기화
    initOrderListeners();
}); 