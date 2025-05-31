export default class SalesFooter {
    constructor({ target, data }) {
        this.$target = target;
        this.data = data;
        this.render();
    }

    calculateTotal() {
        const { cash = 0, card = 0, etc = 0, point = 0 } = this.data;
        return cash + card + etc + point;
    }

    render() {
        const { cash = 0, card = 0, etc = 0, point = 0 } = this.data;
        const total = this.calculateTotal();

        this.$target.innerHTML = `
            <div class="sales-footer">
                <div>현금: ${cash.toLocaleString()}원</div>
                <div>카드: ${card.toLocaleString()}원</div>
                <div>기타: ${etc.toLocaleString()}원</div>
                ${point !== undefined ? `<div>포인트: ${point.toLocaleString()}원</div>` : ''}
                <div><strong>총합계: ${total.toLocaleString()}원</strong></div>
            </div>
        `;
    }
}
