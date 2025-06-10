import Component from "./Component.js";
import ApiService from "../services/ApiService.js";

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

    render() {
        this.$target.innerHTML = this.template();
        this.setEvent(); // 반드시 필요!
    }

    setEvent() {
        this.$target.querySelectorAll(".category-button[data-category]")
            .forEach(btn => {
                btn.addEventListener("click", () => {
                    const category = btn.dataset.category;
                    this.props.onCategorySelect?.(category);
                });
            });
    }
}