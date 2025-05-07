import Component from "./Component.js";

export default class OrderList extends Component {
    setup() {
        this.state = {
            orders: []
        };
        this.handleMenuItemSelected = this.handleMenuItemSelected.bind(this);
    }

    template() {
        return `
        <div class="order-list-items">
            ${this.state.orders.map((item, index) => `
                <div class="order-item">
                    <span>${index + 1}</span>
                    <span>${item.name}</span>
                    <span>${item.quantity}</span>
                    <span>${(item.price * item.quantity).toLocaleString()}</span>
                </div>
            `).join("")}
        </div>
    `;
    }

    mounted() {
        if (!this._bound) {
            document.addEventListener('menuItemSelected', this.handleMenuItemSelected);
            this._bound = true;
        }
    }

    handleMenuItemSelected(e) {
        const { name, price } = e.detail;
        const existing = this.state.orders.find(order => order.name === name);

        let updatedOrders;
        if (existing) {
            updatedOrders = this.state.orders.map(order =>
                order.name === name
                    ? { ...order, quantity: order.quantity + 1 }
                    : order
            );
        } else {
            updatedOrders = [...this.state.orders, { name, price, quantity: 1 }];
        }

        this.setState({ orders: updatedOrders });
    }

    setState(newState) {
        super.setState(newState);
        this.render();
    }
}