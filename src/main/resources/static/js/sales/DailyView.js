import SalesFooter from "./SalesFooter.js";

export default class DailyView {
    constructor({ target, data }) {
        this.$target = target;
        this.data = data;
        this.render();
    }

    generateTimeRows() {
        let rows = '';
        for (let hour = 7; hour <= 21; hour++) {
            const hourStr = String(hour).padStart(2, '0');
            const sales = this.data[hourStr] || { cash: 0, card: 0, point: 0, etc: 0 };

            rows += `
                <tr>
                    <td class="time-cell">${hourStr}시</td>
                    <td>${sales.cash.toLocaleString()}</td>
                    <td>${sales.card.toLocaleString()}</td>
                    <td>${sales.point.toLocaleString()}</td>
                    <td>${sales.etc.toLocaleString()}</td>
                </tr>
            `;
        }
        return rows;
    }

    calculateTotalSummary() {
        const summary = { cash: 0, card: 0, point: 0, etc: 0 };

        Object.values(this.data).forEach(({ cash = 0, card = 0, point = 0, etc = 0 }) => {
            summary.cash += cash;
            summary.card += card;
            summary.point += point;
            summary.etc += etc;
        });

        return summary;
    }

    render() {
        this.$target.innerHTML = `
            <div class="sales-scrollable-container">
                <table class="sales-table">
                    <thead>
                        <tr>
                            <th>시간</th>
                            <th>현금</th>
                            <th>카드</th>
                            <th>포인트</th>
                            <th>기타</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.generateTimeRows()}
                    </tbody>
                </table>
            </div>
            <div class="sales-footer-container"></div>
        `;

        const footerContainer = this.$target.querySelector(".sales-footer-container");
        const totalSummary = this.calculateTotalSummary();

        new SalesFooter({
            target: footerContainer,
            data: totalSummary
        });
    }
}
