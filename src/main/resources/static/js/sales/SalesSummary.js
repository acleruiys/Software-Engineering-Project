import Component from "../main/Component.js";

export default class SalesSummary extends Component {
    setup() {
        this.state = {
            summaryItems: {
                매출총액: "6,800",
                공급가액: "6,182",
                부가세액: "618",
                회원할인: "0",
                일반할인: "0",
                순매출액: "6,800",
                합계금액: "6,800",
                현금소계: "1,500",
                신용카드: "5,300",
                네이버페이: "0",
                포인트: "0",
                상품권: "0",
                토스페이: "0",
                제휴및기타: "0",
                고객수: "2",
                객단가: "3,400",
                테이블: "2",
                포장: "0"
            },
            saleData: [
                { category: "커피", name: "아이스커피", price: "5,000", qty: 3, total: "15,000" },
                { category: "커피", name: "라떼", price: "3,000", qty: 3, total: "9,000" },
            ],
        };
    }

    template() {
        return `
      <div class="modal-container">
        <div class="sales-summary-header">
        <div class="sales-summary-setting">
          <button class="all-summary">전체</button>
          <input type="date" class="summary-date-input start-date" value="2025-04-19">
          <input type="date" class="summary-date-input end-date" value="2025-04-19">
          <button class="search-btn">조회</button>
          <button class="print-btn">🖨️</button>
          <button class="print-btn">🔼</button>
          <button class="print-btn">🔽</button>      
        </div>
        <div class="close-btn">✕</div>
      </div>
        <div class="sales-contents">
          <div class="sales-summary-payment">
            <table class="payment-summary-table">
              <tbody>
                ${this.renderPaymentSummary()}
              </tbody>
            </table>
          </div>
          <div class="sales-summary-menu">
            <table class="menu-summary-table">
              <thead>
                <tr>
                  <th>분류명</th>
                  <th>메뉴</th>
                  <th>단가</th>
                  <th>수량</th>
                  <th>매출금액</th>
                </tr>
              </thead>
              <tbody class="menu-table-body">
                ${this.renderMenuRows()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    }

    renderPaymentSummary() {
        return Object.entries(this.state.summaryItems)
            .map(([label, value]) => `
      <tr>
        <td class="left">${label}</td>
        <td class="right">${value}</td>
      </tr>
    `)
            .join("");
    }


    renderMenuRows() {
        const { saleData } = this.state;

        return saleData.map(item => `
    <tr>
      <td>${item.category}</td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.qty}</td>
      <td>${item.total}</td>
    </tr>
  `).join("");
    }

    mounted() {
        this.setEvent();
    }

    setEvent() {
        this.$target.querySelector(".close-btn")?.addEventListener("click", () => {
            this.hideSalesUI();
        });

        this.$target.querySelector(".search-btn")?.addEventListener("click", () => {
            this.fetchSalesData();
        });
    }

    hideSalesUI() {
        document.querySelector(".overlay").style.display = "none";
        this.$target.style.display = "none";
    }

    fetchSalesData() {
        console.log("매출 데이터 조회");
        // 실제로는 API 호출 후 setState로 summaryItems, saleData 갱신
    }
}
