import Component from "./Component.js";

export default class TotalBilling extends Component {
    setup() {
        this.state = {
            billingAmount: 0,
            orderQuantity: 0
        };
    }

    template() {
        const { billingAmount, orderQuantity } = this.state;

        return `
      <div class="billing-section">
        ${this.createItemTemplate('청구금액', billingAmount)}
        ${this.createItemTemplate('주문수량', orderQuantity)}
      </div>
    `;
    }

    // 항목 렌더링
    createItemTemplate(label, value) {
        return `
      <div class="billing-item">
        <div class="orange">${label}</div>
        <div>${value}</div>
      </div>
    `;
    }

    // 외부에서 값 갱신용
    setState(newState) {
        this.state = {
            billingAmount: newState.billingAmount ?? this.state.billingAmount,
            orderQuantity: newState.orderQuantity ?? this.state.orderQuantity
        };
        this.render();
    }

    setEvent() {}
    updateValue() {}
}
