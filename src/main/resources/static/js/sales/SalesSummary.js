import Component from "../main/Component.js";

const DEFAULT_SUMMARY_ITEMS = {
    매출총액: "0",
    공급가액: "0",
    부가세액: "0",
    회원할인: "0",
    일반할인: "0",
    순매출액: "0",
    합계금액: "0",
    현금소계: "0",
    신용카드: "0",
    네이버페이: "0",
    포인트: "0",
    상품권: "0",
    토스페이: "0",
    제휴및기타: "0",
    고객수: "0",
    객단가: "0",
    테이블: "0",
    포장: "0",
};

/** 결제수단 코드 → summaryItems 키 */
const PAYMENT_METHOD_MAP = {
    CASH: "현금소계",
    CARD: "신용카드",
    NAVERPAY: "네이버페이",
    POINT: "포인트",
    GIFT: "상품권",
    TOSS: "토스페이",
    ETC: "제휴및기타",
};

/** 숫자를 천 단위 콤마로 포맷 */
const fmt = (n) => Number(n || 0).toLocaleString();

export default class SalesSummary extends Component {
    static today() {
        return new Date().toISOString().slice(0, 10);
    }

    setup() {
        const today = SalesSummary.today();
        this.state = {
            dateRange: { start: today, end: today },
            summaryItems: { ...DEFAULT_SUMMARY_ITEMS },
            saleData: [],
        };
    }

    template() {
        const { start, end } = this.state.dateRange;
        return /* html */ `
      <div class="modal-container">
        ${this.renderHeader(start, end)}
        <div class="sales-contents">
          ${this.renderPaymentTable()}
          ${this.renderMenuTable()}
        </div>
      </div>`;
    }

    renderHeader(start, end) {
        return `
      <div class="sales-summary-header">
        <div class="sales-summary-setting">
          <button class="all-summary">전체</button>
          <input type="date" class="summary-date-input start-date" value="${start}">
          <span>~</span>
          <input type="date" class="summary-date-input end-date" value="${end}">
          <button class="search-btn">조회</button>
          <button class="print-btn">🖨️</button>
          <button class="print-btn">🔼</button>
          <button class="print-btn">🔽</button>
        </div>
        <button class="close-btn">✕</button>
      </div>`;
    }

    renderPaymentTable() {
        const rows = Object.entries(this.state.summaryItems)
            .map(([k, v]) => `<tr><td class="left">${k}</td><td class="right">${fmt(v)}</td></tr>`)
            .join("");
        return `
      <div class="sales-summary-payment">
        <table class="payment-summary-table"><tbody>${rows}</tbody></table>
      </div>`;
    }

    renderMenuTable() {
        const rows = this.state.saleData
            .map(
                (m) => `<tr><td>${m.category}</td><td>${m.name}</td><td>${fmt(m.price)}</td><td>${fmt(m.qty)}</td><td>${fmt(m.total)}</td></tr>`,
            )
            .join("");
        return `
      <div class="sales-summary-menu">
        <table class="menu-summary-table">
          <thead>
            <tr><th>분류명</th><th>메뉴</th><th>단가</th><th>수량</th><th>매출금액</th></tr>
          </thead>
          <tbody class="menu-table-body">${rows}</tbody>
        </table>
      </div>`;
    }

    mounted() {
        this.bindEvents();
        this.fetchSalesData();
    }

    bindEvents() {
        this.$target.addEventListener("click", (e) => {
            if (e.target.closest(".close-btn")) return this.hide();
            if (e.target.closest(".search-btn")) return this.fetchSalesData();
        });
    }

    hide() {
        document.querySelector(".overlay")?.style.setProperty("display", "none");
        this.$target.style.display = "none";
    }

    async fetchSalesData() {
        const start = this.$target.querySelector(".start-date")?.value;
        const end   = this.$target.querySelector(".end-date")?.value;

        if (!start || !end) return alert("조회 기간을 선택해 주세요.");

        if (new Date(start) > new Date(end)) {
            alert("시작 날짜가 종료 날짜보다 늦습니다.");
            return;
        }

        const payload = {
            startDate: `${start}T00:00:00Z`,
            endDate:   `${end}T23:59:59Z`,
        };

        try {
            const res = await fetch("/api/sales/summary", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const api          = await res.json();
            const summaryItems = this.buildSummaryItems(api);
            const saleData     = this.buildSaleData(api);

            this.setState({ summaryItems, saleData, dateRange: { start, end } });
        } catch (err) {
            console.error(err);
            alert("매출 데이터를 불러오는 데 실패했습니다.");
        }
    }


    buildSummaryItems({ totalMember = 0, menus = [], payments = [] }) {
        const totalSales = menus.reduce((sum, m) => sum + +m.totalPrice, 0);
        const vat = Math.floor(totalSales * 0.1);
        const supply = totalSales - vat;

        const result = { ...DEFAULT_SUMMARY_ITEMS };
        result.매출총액 = result.순매출액 = result.합계금액 = totalSales;
        result.공급가액 = supply;
        result.부가세액 = vat;
        result.고객수 = String(totalMember);
        result.객단가 = totalMember ? Math.round(totalSales / totalMember) : "0";

        payments.forEach(({ method, methodPerPrice }) => {
            const key = PAYMENT_METHOD_MAP[method];
            if (key) result[key] = methodPerPrice;
        });

        return result; // 숫자 상태 그대로 보관, 렌더 시 fmt 처리
    }

    buildSaleData({ menus = [] }) {
        return menus.map((m) => {
            const unit = m.totalQuantity ? m.totalPrice / m.totalQuantity : 0;
            return {
                category: m.category,
                name: m.menu.trim(),
                price: unit,
                qty: m.totalQuantity,
                total: m.totalPrice,
            };
        });
    }
}
