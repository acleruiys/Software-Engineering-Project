import Component from "./Component.js";

export default class CategoryPanel extends Component {
    setup() {
        this.state = {
            categories: []
        };
        
        // 카테고리 데이터 가져오기
        this.fetchCategories();
    }
    
    async fetchCategories() {
        try {
            // 서버 API에서 카테고리 가져오기
            const response = await fetch('/api/categories');
            if (!response.ok) {
                throw new Error('카테고리를 불러오는데 실패했습니다.');
            }
            const data = await response.json();
            this.setState({ categories: data });
        } catch (error) {
            console.error('카테고리 데이터 불러오기 오류:', error);
            // 서버 API가 없는 경우를 대비해 정적 데이터 로드
            import('../data/MenuData.js').then(module => {
                this.setState({ categories: module.categories });
            });
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
                btn.addEventListener("click", e => {
                    // 활성화된 카테고리 버튼 스타일 변경
                    this.$target.querySelectorAll(".category-button").forEach(b => {
                        b.classList.remove("active");
                    });
                    e.target.classList.add("active");
                    
                    // 카테고리 선택 이벤트 호출
                    const category = e.target.dataset.category;
                    this.props.onCategorySelect?.(category);
                });
            });
    }
}
