import Component from "./Component.js";

export default class Navbar extends Component {
  setup() {
    this.state = {
      now: new Date()
    };
  }

  template() {
    const { now } = this.state;
    const timeString = this.formatTime(now);

    return `
      <div class="header">
        <div class="header-left">
          <div class="title">회사명</div>
          <ul class="title-ect">
            <li>날짜 및 시간 : <a id="clock">${timeString}</a></li>
            <li>관리자</li>
          </ul>
        </div>
        <div class="header-right">
          <div id="sales-btn">매출</div>
          <div>재고</div>
          <div>직원</div>
          <div>설정</div>
          <div>-</div>
          <div>X</div>
        </div>
      </div>
    `;
  }

  formatTime(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}/${hours}:${minutes}:${seconds}`;
  }

  setEvent() {
    const salesBtn = this.$target.querySelector('#sales-btn');
    if (salesBtn) {
      salesBtn.addEventListener('click', () => this.showSalesUI());
    }
  }

  mounted() {
    this.startClock();
  }

  startClock() {
    this.timer = setInterval(() => {
      const now = new Date();
      this.state.now = now; // 상태도 갱신
      const clockEl = this.$target.querySelector('#clock');
      if (clockEl) {
        clockEl.textContent = this.formatTime(now);
      }
    }, 1000);
  }

  beforeUnmount() {
    clearInterval(this.timer);
  }

  showSalesUI() {
    alert('매출 UI 표시');
  }
}
