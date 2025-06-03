import Component from "./Component.js";

export default class MenuGrid extends Component {
    setup() {
        this.state = {
            menuItems: this.props.menuItems || []
        };
    }

    setMenuItems(newItems) {
        if (JSON.stringify(newItems) !== JSON.stringify(this.state.menuItems)) {
            this.setState({ menuItems: newItems });
        }
    }

    template() {
        const totalItems = 7 * 9;
        const items = Array.from({ length: totalItems }, (_, i) => this.state.menuItems[i] || null);

        return `
            <div class="menuEntity-grid">
                ${items.map((item, index) => `
                    <div class="menuEntity-item" data-index="${index}">
                        ${item ? `
                            <div class="menuEntity-item-inner">
                                <div class="menuEntity-item-name">${item.name}</div>
                                <div class="menuEntity-item-price">${item.price.toLocaleString()}원</div>
                            </div>
                        ` : ""}
                    </div>
                `).join("")}
            </div>
        `;
    }

    mounted() {
        if (this.$target) {
            this.addEventListeners();
        } else {
            console.error("MenuGrid: this.$target is not defined!");
        }
    }

    addEventListeners() {
        const grid = this.$target.querySelector('.menuEntity-grid');
        if (!grid) return;

        grid.addEventListener('click', (e) => {
            const itemDiv = e.target.closest('.menuEntity-item');
            if (!itemDiv) return;

            const index = itemDiv.dataset.index;
            const item = this.state.menuItems[index];
            if (item) {
                document.dispatchEvent(new CustomEvent('menuItemSelected', { detail: item }));
            }
        });
    }

    setState(newState) {
        super.setState(newState);
        this.render();
        this.mounted();
    }
}
