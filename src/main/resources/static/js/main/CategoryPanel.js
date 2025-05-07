import Component from "./Component.js";

export default class CategoryPanel extends Component {
    setup() {
        this.state = {
            categories: [
                { label: "커피", value: "COFFEE" },
                { label: "디카페인", value: "DECAF" },
                { label: "논커피<br>과일라떼", value: "NON_COFFEE" },
                { label: "티", value: "TEA" },
                { label: "스무디<br>프라페", value: "SMOOTHIE" },
                { label: "에이드<br>주스", value: "ADE" },
                { label: "시즌메뉴", value: "SEASON" },
                { label: "빵", value: "BREAD" },
                { label: "" },
                { label: "" },
                { label: "" },
                { label: "" },
                { label: "" },
                { label: "" }
            ]
        };
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
                    const category = e.target.dataset.category;
                    this.props.onCategorySelect?.(category);
                });
            });
    }
}
