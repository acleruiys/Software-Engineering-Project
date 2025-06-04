import Component from "./Component.js";

export default class Billing extends Component {
    setup() {
        this.state = {
            items: [
                { label: '주문금액', value: 0 },
                { label: '서비스', value: 0 },
                { label: '할인금액', value: 0 },
                { label: '봉사료', value: 0 }
            ]
        };
        this.totalBillingComponent = this.props.totalBillingComponent;
    }

    render() {
        super.render();

        const orderAmount = this.getAmount('주문금액');
        const discountAmount = this.getAmount('할인금액');
        const orderList = window.__orderList__ || [];
        const orderCount = orderList.reduce((acc, item) => acc + item.quantity, 0);

        if (this.totalBillingComponent) {
            this.totalBillingComponent.updateTotal(orderAmount, discountAmount, orderCount);
        }

        this.setEvent();
    }

    template() {
        return `
      <div class="total-section">
        ${this.state.items.map(item => this.createTotalItemTemplate(item)).join('')}
      </div>
    `;
    }

    createTotalItemTemplate(item) {
        return `
      <div class="total-item">
        <div>${item.label}</div>
        <div>${item.value}</div>
      </div>
    `;
    }

    setEvent() {
        const totalItems = this.$target.querySelectorAll('.total-item');
        totalItems.forEach(item => {
            item.addEventListener('click', () => this.updateValue(item));
        });
    }

    updateValue(item) {
        const label = item.querySelector('div').textContent;
        const index = this.state.items.findIndex(i => i.label === label);
        if (index !== -1) {
            this.state.items[index].value += 10;
            this.render();
        }
    }

    updateDiscountAmount(amount) {
        const index = this.state.items.findIndex(i => i.label === '할인금액');
        if (index !== -1) {
            this.state.items[index].value = amount;
            this.render(); // 여기서 render() 호출하면 updateTotal도 자동 호출됨
        }
    }

    updateOrderAmount(amount) {
        const index = this.state.items.findIndex(item => item.label === '주문금액');
        if (index !== -1) {
            this.state.items[index].value = amount;
            this.render();
        }
    }

    getAmount(label) {
        const item = this.state.items.find(i => i.label === label);
        return item ? item.value : 0;
    }
}