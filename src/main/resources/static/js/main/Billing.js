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
        // 1. 부모 메서드 호출 (템플릿 렌더링)
        super.render();

        // 2. 추가 작업: TotalBilling 갱신
        const orderAmount = this.getAmount('주문금액');
        const discountAmount = this.getAmount('할인금액');
        const orderCount = window.__orderList__ ? window.__orderList__.reduce((sum, item) => sum + item.quantity, 0) : 0;

        if (this.totalBillingComponent && typeof this.totalBillingComponent.updateTotal === 'function') {
            this.totalBillingComponent.updateTotal(orderAmount, discountAmount, orderCount);
        }

        // 3. 이벤트 바인딩
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
            this.render();

            this.updateTotalBilling(); // 총 합계 갱신
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