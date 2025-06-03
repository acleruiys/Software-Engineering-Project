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
      <div class="total-item" data-label="${item.label}">
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
        const label = item.dataset.label;
        const index = this.state.items.findIndex(i => i.label === label);
        if (index !== -1) {
            this.state.items[index].value += 10;
            this.render();
        }
    }

    setState(newBilling) {
        this.state.items = [
            { label: '주문금액', value: newBilling.orderAmount || 0 },
            { label: '서비스', value: newBilling.serviceFee || 0 },
            { label: '할인금액', value: newBilling.discount || 0 },
            { label: '봉사료', value: newBilling.tip || 0 }
        ];
        this.render();
    }
}
