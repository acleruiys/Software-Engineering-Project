import Component from './Component.js';
import CategoryPanel from './CategoryPanel.js';
import MenuGrid from './MenuGrid.js';

export default class App extends Component {
    setup() {
        this.menuItemsByCategory = {
            COFFEE: [
                { name: "아메리카노", price: 3000 },
                { name: "카페라떼", price: 5500 },
                { name: "카푸치노", price: 5500 }
            ],
            DECAF: [{ name: "디카페인 아메리카노", price: 3000 }],
            NON_COFFEE: [{ name: "딸기라떼", price: 6000 }, { name: "바나나라떼", price: 6000 }],
            TEA: [{ name: "녹차", price: 5000 }, { name: "홍차", price: 5000 }],
            SMOOTHIE: [{ name: "망고스무디", price: 6500 }],
            ADE: [{ name: "레몬에이드", price: 6000 }],
            SEASON: [{ name: "겨울한정 핫초코", price: 5000 }],
            BREAD: [{ name: "크루아상", price: 4000 }, { name: "식빵", price: 3000 }]
        };

        this.state = {
            menuItems: this.menuItemsByCategory.COFFEE
        };

        this.orderList = [];
        this.menuGrid = null;
        this.categoryPanel = null;

        this.handleMenuItemSelected = this.handleMenuItemSelected.bind(this);
    }

    template() {
        return '';
    }

    render() {
        if (this.menuGrid) {
            this.menuGrid.setMenuItems(this.state.menuItems);
        }
        this.renderOrderList();
    }

    mounted() {
        if (!this.categoryPanel) {
            this.categoryPanel = new CategoryPanel({
                target: document.querySelector('#categoryPanel'),
                props: {
                    onCategorySelect: (category) => {
                        const items = this.menuItemsByCategory[category] || [];
                        this.setState({ menuItems: items });
                    }
                }
            });
        }

        if (!this.menuGrid) {
            this.menuGrid = new MenuGrid({
                target: document.querySelector('#menuGrid'),
                props: {
                    menuItems: this.state.menuItems
                }
            });
        }

        document.removeEventListener('menuItemSelected', this.handleMenuItemSelected);
        document.addEventListener('menuItemSelected', this.handleMenuItemSelected);

        this.renderOrderList();
    }

    handleMenuItemSelected(e) {
        const selected = e.detail;
        const existing = this.orderList.find(item => item.name === selected.name);

        if (existing) {
            existing.quantity += 1;
            existing.totalPrice = existing.quantity * existing.price;
        } else {
            this.orderList.push({
                id: this.orderList.length + 1,
                name: selected.name,
                quantity: 1,
                price: selected.price,
                totalPrice: selected.price
            });
        }

        this.renderOrderList();
    }

    renderOrderList() {
        const container = document.querySelector('.order-list');
        if (!container) return;

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'order-list-items';

        this.orderList.forEach((item, index) => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';

            const indexSpan = document.createElement('span');
            indexSpan.textContent = `${index + 1}`;

            const nameSpan = document.createElement('span');
            nameSpan.textContent = item.name;

            const quantitySpan = document.createElement('span');
            quantitySpan.textContent = item.quantity;

            const totalPriceSpan = document.createElement('span');
            totalPriceSpan.textContent = (item.price * item.quantity).toLocaleString();

            orderItem.append(indexSpan, nameSpan, quantitySpan, totalPriceSpan);
            wrapper.appendChild(orderItem);
        });

        container.appendChild(wrapper);
    }

}
