class ApiService {
    static BASE_URL = '/api';

    // 카테고리 조회
    static async getCategories() {
        try {
            const response = await fetch(`${this.BASE_URL}/categories`);
            if (!response.ok) {
                throw new Error('카테고리 조회에 실패했습니다.');
            }
            return await response.json();
        } catch (error) {
            console.error('카테고리 조회 오류:', error);
            throw error;
        }
    }

    // 전체 메뉴 조회
    static async getAllMenus() {
        try {
            const response = await fetch(`${this.BASE_URL}/menus`);
            if (!response.ok) {
                throw new Error('메뉴 조회에 실패했습니다.');
            }
            return await response.json();
        } catch (error) {
            console.error('메뉴 조회 오류:', error);
            throw error;
        }
    }

    // 카테고리별 메뉴 조회
    static async getMenusByCategory(category) {
        try {
            const response = await fetch(`${this.BASE_URL}/menus?category=${category}`);
            if (!response.ok) {
                throw new Error('카테고리별 메뉴 조회에 실패했습니다.');
            }
            return await response.json();
        } catch (error) {
            console.error('카테고리별 메뉴 조회 오류:', error);
            throw error;
        }
    }

    // 메뉴 추가
    static async addMenu(menuData) {
        try {
            const response = await fetch(`${this.BASE_URL}/menus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(menuData)
            });
            if (!response.ok) {
                throw new Error('메뉴 추가에 실패했습니다.');
            }
            return await response.json();
        } catch (error) {
            console.error('메뉴 추가 오류:', error);
            throw error;
        }
    }

    // 메뉴 수정
    static async updateMenu(id, menuData) {
        try {
            const response = await fetch(`${this.BASE_URL}/menus/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(menuData)
            });
            if (!response.ok) {
                throw new Error('메뉴 수정에 실패했습니다.');
            }
            return await response.json();
        } catch (error) {
            console.error('메뉴 수정 오류:', error);
            throw error;
        }
    }

    // 메뉴 삭제
    static async deleteMenu(id) {
        try {
            const response = await fetch(`${this.BASE_URL}/menus/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('메뉴 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('메뉴 삭제 오류:', error);
            throw error;
        }
    }
}

export default ApiService; 