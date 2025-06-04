import Component from "./Component.js";

export default class TotalBilling extends Component {
    setup() {
        this.state = {
            billingAmount: 0,
            orderQuantity: 0
        };
    }

    template() {
        return `
      <div class="billing-section">
        ${this.createItemTemplate('청구금액', this.state.billingAmount)}
        ${this.createItemTemplate('주문수량', this.state.orderQuantity)}
      </div>
    `;
    }

    createItemTemplate(label, value) {
        return `
      <div class="billing-item">
        <div class="orange">${label}</div>
        <div>${value}</div>
      </div>
    `;
    }

    setEvent() {

    }

    updateValue(item) {

    }

    // Billing 컴포넌트에서 호출될 외부 메서드 추가
    updateTotal(orderAmount, discountAmount, orderCount) {
        const billingAmount = orderAmount - discountAmount;
        this.setState({
            billingAmount,
            orderQuantity: orderCount
        });
    }
}
