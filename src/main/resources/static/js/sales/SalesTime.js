import Component from "../main/Component.js";
import DailyView from "./DailyView.js";
import MonthlyView from "./MonthlyView.js";
import YearlyView from "./YearlyView.js";
import SalesFooter from "./SalesFooter.js";

export default class SalesTime extends Component {
    setup() {
        this.selectedTab = 'monthly';
        this.selectedDate = '2025-04-04';
        this.selectedYear = 2025;
        this.selectedMonth = 4;
    }

    template() {
        return `
      <div class="modal-container">
        <div class="modal-header">
          <div class="date-selector-container">
            ${this.renderDateSelector()}
          </div>
          <div class="close-btn">✕</div>
        </div>
        <div class="sales-tab-container">
          <div class="sales-tab ${this.selectedTab === 'daily' ? 'active' : ''}" data-tab="daily">일별</div>
          <div class="sales-tab ${this.selectedTab === 'monthly' ? 'active' : ''}" data-tab="monthly">월별</div>
          <div class="sales-tab ${this.selectedTab === 'yearly' ? 'active' : ''}" data-tab="yearly">년도별</div>
        </div>
        <div class="sales-view-container"></div>
      </div>
    `;
    }

    mounted() {
        this.renderTabContent();
    }

    setEvent() {
        this.$target.querySelectorAll('.sales-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                if (this.selectedTab !== tabName) {
                    this.selectedTab = tabName;
                    this.updateDateSelector();
                    this.renderTabContent();
                }
            });
        });

        const dateInput = this.$target.querySelector('.date-input');
        if (dateInput) {
            dateInput.addEventListener('change', (e) => {
                this.selectedDate = e.target.value;
                this.renderTabContent();
            });
        }

        const closeBtn = this.$target.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideSalesUI();
            });
        }

        this.addYearMonthChangeEvents();
    }

    addYearMonthChangeEvents() {
        const prevYearBtn = this.$target.querySelector('.prev-Year');
        const nextYearBtn = this.$target.querySelector('.next-Year');
        const prevMonthBtn = this.$target.querySelector('.prev-Month');
        const nextMonthBtn = this.$target.querySelector('.next-Month');

        if (prevYearBtn && nextYearBtn) {
            prevYearBtn.addEventListener('click', () => this.changeYear(-1));
            nextYearBtn.addEventListener('click', () => this.changeYear(1));
        }
        if (prevMonthBtn && nextMonthBtn) {
            prevMonthBtn.addEventListener('click', () => this.changeMonth(-1));
            nextMonthBtn.addEventListener('click', () => this.changeMonth(1));
        }
    }

    renderTabContent() {
        const container = this.$target.querySelector('.sales-view-container');
        container.innerHTML = ''; // 기존 뷰 클리어

        const viewWrapper = document.createElement('div');
        const footerContainer = document.createElement('div');
        footerContainer.className = 'sales-footer-container';

        container.appendChild(viewWrapper);
        container.appendChild(footerContainer);

        let viewInstance;
        if (this.selectedTab === 'daily') {
            const dailyData = this.getDailyDataFor(this.selectedDate);
            viewInstance = new DailyView({
                target: viewWrapper,
                data: dailyData
            });

        } else if (this.selectedTab === 'monthly') {
            viewInstance = new MonthlyView({
                target: viewWrapper,
                selectedYear: this.selectedYear,
                selectedMonth: this.selectedMonth
            });

        } else if (this.selectedTab === 'yearly') {
            const yearlyData = this.mockYearlyData(this.selectedYear);
            viewInstance = new YearlyView({
                target: viewWrapper,
                selectedYear: this.selectedYear,
                salesData: yearlyData
            });
        }

        if (viewInstance?.getSummary) {
            const summary = viewInstance.getSummary();
            new SalesFooter({
                target: footerContainer,
                data: summary
            });
        }
    }

    renderDateSelector() {
        if (this.selectedTab === 'daily') {
            return `<input type="date" class="date-input" value="${this.selectedDate}">`;
        } else if (this.selectedTab === 'monthly') {
            return `<div class="monthly-header-container">${this.renderMonthlyHeader()}</div>`;
        } else if (this.selectedTab === 'yearly') {
            return `<div class="yearly-header-container">${this.renderYearlyHeader()}</div>`;
        }
    }

    renderMonthlyHeader() {
        return `
            <div class="monthly-header">
                <button class="prev-Year">◀</button>
                <span class="year-label">${this.selectedYear}년 </span>
                <button class="next-Year">▶</button>
                
                <button class="prev-Month">◀</button>
                <span class="month-label">${this.selectedMonth}월</span>
                <button class="next-Month">▶</button>
            </div>
        `;
    }

    renderYearlyHeader() {
        return `
            <div class="yearly-header">
                <button class="prev-Year">◀</button>
                <span class="year-label">${this.selectedYear}년 </span>
                <button class="next-Year">▶</button>
            </div>`
    }

    updateDateSelector() {
        const container = this.$target.querySelector('.date-selector-container');
        if (container) {
            container.innerHTML = this.renderDateSelector();
            this.setEvent();
        }
    }

    changeYear(offset) {
        this.selectedYear += offset;
        this.updateYearLabel();
        this.renderTabContent();
    }

    changeMonth(offset) {
        let { selectedYear, selectedMonth } = this;
        selectedMonth += offset;
        if (selectedMonth === 0) {
            selectedMonth = 12;
            selectedYear -= 1;
        } else if (selectedMonth === 13) {
            selectedMonth = 1;
            selectedYear += 1;
        }

        this.selectedYear = selectedYear;
        this.selectedMonth = selectedMonth;

        this.updateYearLabel();
        this.updateMonthLabel();
        this.renderTabContent();
    }

    updateYearLabel() {
        const yearLabel = this.$target.querySelector('.year-label');
        if (yearLabel) {
            yearLabel.textContent = `${this.selectedYear}년 `;
        }
    }

    updateMonthLabel() {
        const monthLabel = this.$target.querySelector('.month-label');
        if (monthLabel) {
            monthLabel.textContent = `${this.selectedMonth}월`;
        }
    }

    // Daily 데이터를 생성하는 메서드
    getDailyDataFor(date) {
        const data = {};
        for (let hour = 7; hour <= 21; hour++) {
            const hourStr = String(hour).padStart(2, '0');
            data[hourStr] = {
                cash: Math.floor(Math.random() * 10000),
                card: Math.floor(Math.random() * 10000),
                point: Math.floor(Math.random() * 1000),
                etc: Math.floor(Math.random() * 500)
            };
        }
        return data;
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

    calculateSummary(data) {
        const summary = { cash: 0, card: 0, point: 0, etc: 0 };
        Object.values(data).forEach(({ cash, card, point, etc }) => {
            summary.cash += cash;
            summary.card += card;
            summary.point += point;
            summary.etc += etc;
        });
        return summary;
    }

    showSalesUI() {
        document.querySelector('.overlay').style.display = 'block';
        this.$target.style.display = 'block';
    }

    hideSalesUI() {
        document.querySelector('.overlay').style.display = 'none';
        this.$target.style.display = 'none';
    }
}