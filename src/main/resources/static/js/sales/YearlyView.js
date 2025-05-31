import Component from "../main/Component.js";

export default class YearlyView extends Component {
    constructor({ target, selectedYear, salesData, onYearChange }) {
        super({ target });

        this.props = {
            selectedYear,
            salesData,
            onYearChange
        };

        this.setup();
        this.render();
        this.setEvent();
    }

    setup() {
        const { selectedYear, salesData } = this.props;
        this.state = {
            year: selectedYear,
            salesData: salesData || this.mockYearlyData(selectedYear),
        };
    }

    template() {
        const { year, salesData } = this.state;

        let summaryHTML = `<div class="yearly-grid">`;

        for (let month = 1; month <= 12; month++) {
            const key = `${year}-${String(month).padStart(2, "0")}`;
            const data = salesData[key] || { cash: 0, card: 0, point: 0, etc: 0 };
            const total = data.cash + data.card + data.point + data.etc;

            summaryHTML += `
        <div class="year-cell">
            <div class="month-label">${month}월</div>
            <div>현금: ${data.cash}</div>
            <div>카드: ${data.card}</div>
            <div>포인트: ${data.point}</div>
            <div>기타: ${data.etc}</div>
            <div><strong>합계: ${total}</strong></div>
        </div>
        `;
        }

        summaryHTML += `</div>`;

        return `
    ${summaryHTML}
    `;
    }

    setEvent() {
        const prevYearBtn = this.$target.querySelector(".prev-Year");
        const nextYearBtn = this.$target.querySelector(".next-Year");
        if (prevYearBtn && nextYearBtn) {
            prevYearBtn.addEventListener("click", () => {
                this.changeYear(-1);
            });
            nextYearBtn.addEventListener("click", () => {
                this.changeYear(1);
            });
        }
    }


    changeYear(offset) {
        const newYear = this.state.year + offset;
        if (this.props.onYearChange) {
            this.props.onYearChange(newYear);
        }
    }

    getSummary() {
        const { salesData } = this.state;
        const summary = { cash: 0, card: 0, point: 0, etc: 0 };

        Object.values(salesData).forEach(({ cash, card, point, etc }) => {
            summary.cash += cash;
            summary.card += card;
            summary.point += point;
            summary.etc += etc;
        });

        return summary;
    }

    mockYearlyData(year) {
        const data = {};
        for (let month = 1; month <= 12; month++) {
            const key = `${year}-${String(month).padStart(2, "0")}`;
            data[key] = {
                cash: Math.floor(Math.random() * 20000),
                card: Math.floor(Math.random() * 30000),
                point: Math.floor(Math.random() * 5000),
                etc: Math.floor(Math.random() * 10000),
            };
        }
        return data;
    }
}
