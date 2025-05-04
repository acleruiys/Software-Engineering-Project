import Component from "../main/Component.js";
import DailyView from "./DailyView.js";
import MonthlyView from "./MonthlyView.js";
import YearlyView from "./YearlyView.js";

export default class SalesTime extends Component {
    setup() {
        this.state = {
            selectedTab: 'daily',
            selectedDate: '2025-04-04',
            selectedYear: 2025,
            selectedMonth: 4
        };
    }

    template() {
        const { selectedTab, selectedDate } = this.state;

        return `
      <div class="sales-container">
        <div class="sales-header">
          <div class="date-selector">
            ${selectedTab === 'daily' ? `<input type="date" class="date-input" value="${selectedDate}">` : ''}
          </div>
          <div class="close-btn">✕</div>
        </div>
        <div class="sales-tab-container">
          <div class="sales-tab ${selectedTab === 'daily' ? 'active' : ''}" data-tab="daily">일별</div>
          <div class="sales-tab ${selectedTab === 'monthly' ? 'active' : ''}" data-tab="monthly">월별</div>
          <div class="sales-tab ${selectedTab === 'yearly' ? 'active' : ''}" data-tab="yearly">년도별</div>
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
                this.setState({ selectedTab: tabName });
            });
        });

        const dateInput = this.$target.querySelector('.date-input');
        if (dateInput) {
            dateInput.addEventListener('change', (e) => {
                this.setState({ selectedDate: e.target.value });
            });
        }

        this.$target.querySelector('.close-btn').addEventListener('click', () => {
            this.hideSalesUI();
        });
    }

    renderTabContent() {
        const container = this.$target.querySelector('.sales-view-container');

        const { selectedTab, selectedDate, selectedYear, selectedMonth } = this.state;

        if (selectedTab === 'daily') {
            const dailyData = this.getDailyDataFor(selectedDate);
            new DailyView({
                target: container,
                data: dailyData
            });
        } else if (selectedTab === 'monthly') {
            new MonthlyView(container, { selectedYear, selectedMonth });
        } else if (selectedTab === 'yearly') {
            new YearlyView(container, { selectedYear });
        }
    }

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

    showSalesUI() {
        document.querySelector('.overlay').style.display = 'block';
        this.$target.style.display = 'block';
    }

    hideSalesUI() {
        document.querySelector('.overlay').style.display = 'none';
        this.$target.style.display = 'none';
    }
}
