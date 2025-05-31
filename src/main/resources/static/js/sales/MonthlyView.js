import Component from "../main/Component.js";
import { getDaysInMonth, formatDate, getDayOfWeek } from "../utils/dateUtils.js";

export default class MonthlyView extends Component {
    constructor({ target, selectedYear, selectedMonth }) {
        super({
            target,
            props: { selectedYear, selectedMonth }
        });
        this.setup();
        this.render();
    }

    setup() {
        const { selectedYear, selectedMonth } = this.props;
        this.state = {
            year: selectedYear,
            month: selectedMonth,
            salesData: this.mockSalesData(selectedYear, selectedMonth)
        };
    }

    template() {
        const { year, month, salesData } = this.state;
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getDayOfWeek(year, month, 1);

        let calendarHTML = '<div class="monthly-calendar">';
        let dayCounter = 1;
        let rowHTML = '';

        for (let i = 0; i < 7; i++) {
            if (i < firstDayOfMonth) {
                rowHTML += `<div class="calendar-cell empty"></div>`;
            } else {
                const dateStr = formatDate(year, month, dayCounter);
                const data = salesData[dateStr] || { cash: 0, card: 0, point: 0, etc: 0 };
                const total = data.cash + data.card + data.point + data.etc;

                rowHTML += `
                    <div class="calendar-cell">
                        <div class="date-label">${dayCounter}일</div>
                        <div class="sales-summary">
                            <div>현금: ${data.cash}</div>
                            <div>카드: ${data.card}</div>
                            <div>포인트: ${data.point}</div>
                            <div>기타: ${data.etc}</div>
                            <div><strong>합계: ${total}</strong></div>
                        </div>
                    </div>
                `;
                dayCounter++;
            }
        }

        calendarHTML += rowHTML;

        while (dayCounter <= daysInMonth) {
            rowHTML = '';
            for (let i = 0; i < 7; i++) {
                if (dayCounter > daysInMonth) {
                    rowHTML += `<div class="calendar-cell empty"></div>`;
                } else {
                    const dateStr = formatDate(year, month, dayCounter);
                    const data = salesData[dateStr] || { cash: 0, card: 0, point: 0, etc: 0 };
                    const total = data.cash + data.card + data.point + data.etc;

                    rowHTML += `
                        <div class="calendar-cell">
                            <div class="date-label">${dayCounter}일</div>
                            <div class="sales-summary">
                                <div>현금: ${data.cash}</div>
                                <div>카드: ${data.card}</div>
                                <div>포인트: ${data.point}</div>
                                <div>기타: ${data.etc}</div>
                                <div><strong>합계: ${total}</strong></div>
                            </div>
                        </div>
                    `;
                    dayCounter++;
                }
            }
            calendarHTML += rowHTML;
        }

        calendarHTML += '</div>';
        return calendarHTML;
    }

    mockSalesData(year, month) {
        const days = getDaysInMonth(year, month);
        const data = {};
        for (let i = 1; i <= days; i++) {
            const dateStr = formatDate(year, month, i);
            data[dateStr] = {
                cash: Math.floor(Math.random() * 10000),
                card: Math.floor(Math.random() * 15000),
                point: Math.floor(Math.random() * 3000),
                etc: Math.floor(Math.random() * 2000)
            };
        }
        return data;
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

    updateView(year, month) {
        this.state.year = year;
        this.state.month = month;
        this.state.salesData = this.mockSalesData(year, month);
        this.render();
    }
}
