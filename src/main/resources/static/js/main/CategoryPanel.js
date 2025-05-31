import Component from "./Component.js";
import { categories } from "../data/MenuData.js";

export default class CategoryPanel extends Component {
    setup() {
        this.state = {
            categories: categories
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
