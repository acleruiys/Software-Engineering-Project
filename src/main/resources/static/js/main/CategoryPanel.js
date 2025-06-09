import Component from "./Component.js";
import ApiService from "../services/ApiService.js";
import MenuGrid from "./MenuGrid";

export default class CategoryPanel extends Component {
    setup() {
        this.state = {
            categories: []
        };
        this.loadCategories();
    }

    async loadCategories() {
        try {
            const categories = await ApiService.getCategories();
            this.setState({ categories });
        } catch (error) {
            console.error('카테고리 로딩 실패:', error);
            // 에러 발생 시 빈 배열로 설정
            this.setState({ categories: [] });
        }
    }

    template() {
        return `
      <div class="category-grid">
        ${this.state.categories.map(cat => {
            const label = cat.label || "";
            const value = cat.value ? `data-category="${cat.value}"` : "";
            return `<div class="category-button" ${value}>${label}</div>`;
        }).join("")}
      </div>
    `;
    }

    setEvent() {
        this.$target.querySelectorAll(".category-button[data-category]")
            .forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    const category = e.target.dataset.category;
                    
                    // 선택된 카테고리 버튼 스타일 업데이트
                    this.$target.querySelectorAll(".category-button").forEach(b => b.classList.remove("active"));
                    e.target.classList.add("active");
                    
                    try {
                        // 카테고리별 메뉴 아이템 로드
                        const menuItems = await ApiService.getMenusByCategory(category);
                        
                        // MenuGrid에 새로운 메뉴 아이템 설정
                        if (this.props.menuGrid) {
                            this.props.menuGrid.setMenuItems(menuItems);
                        }
                        
                        // 부모 컴포넌트에 카테고리 선택 알림
                        await this.props.onCategorySelect?.(category);
                    } catch (error) {
                        console.error('카테고리별 메뉴 로딩 실패:', error);
                        // 에러 발생 시 빈 배열로 설정
                        if (this.props.menuGrid) {
                            this.props.menuGrid.setMenuItems([]);
                        }
                    }
                });
            });
    }
}
