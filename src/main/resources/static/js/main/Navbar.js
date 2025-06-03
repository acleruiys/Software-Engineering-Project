import Component from "./Component.js";
import SalesTime from '../sales/SalesTime.js';
import MenuSystem from "../menu/MenuSystem.js";
import EmployeeSystem from "../employee/employeeSystem.js";
import InventorySystem from "../inventory/InventorySystem.js";
import SupplySystem from "../supply/SupplySystem.js";

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
          <div id="employee-btn">직원</div>
          <div id="menu-btn">메뉴</div>
          <div id="inventory-btn">재고</div>
          <div id="supply-btn">납품업체</div>
          <div id="setting-btn">설정</div>
          <div>
            <div>-</div>
            <div>X</div>
          </div>
        </div>
      </div>
      <div id="submenu-container"></div>
    `;
  }

  formatTime(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}/${hours}:${minutes}`;
  }

  setEvent() {
    const salesBtn = this.$target.querySelector('#sales-btn');
    const submenuContainer = this.$target.querySelector('#submenu-container');
    const menuBtn = this.$target.querySelector('#menu-btn');
    const employeeBtn = this.$target.querySelector('#employee-btn');
    const inventoryBtn = this.$target.querySelector('#inventory-btn');
    const supplyBtn = this.$target.querySelector('#supply-btn');

    // 공통 모달 열기 함수
    const openModalComponent = (ComponentClass) => {
      const modalRoot = document.querySelector('#salesTime');
      const overlay = document.querySelector('.overlay');

      if (!modalRoot || !overlay) {
        console.error('modalRoot 또는 overlay가 존재하지 않습니다.');
        return;
      }

      modalRoot.innerHTML = '';
      modalRoot.style.display = 'block';
      overlay.style.display = 'block';

      new ComponentClass({ target: modalRoot });

      const handleOutsideClick = (e) => {
        if (!modalRoot.contains(e.target)) {
          modalRoot.style.display = 'none';
          overlay.style.display = 'none';
          document.removeEventListener('click', handleOutsideClick);
        }
      };

      setTimeout(() => {
        document.addEventListener('click', handleOutsideClick);
      }, 0);
    };

    // 매출 버튼 클릭
    salesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = submenuContainer.style.display === 'block';

      if (isVisible) {
        submenuContainer.style.display = 'none';
      } else {
        submenuContainer.innerHTML = `
        <div class="sales-submenu">
          <button id="sales-summary-btn">매출 집계 조회</button>
          <button id="sales-period-btn">기간별 매출 현황</button>
        </div>
      `;
        submenuContainer.style.display = 'block';

        setTimeout(() => {
          const periodBtn = this.$target.querySelector('#sales-period-btn');
          periodBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            openModalComponent(SalesTime);
            submenuContainer.style.display = 'none';
          });
        }, 0);
      }
    });

    // 메뉴 버튼 클릭
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModalComponent(MenuSystem);
    });

    // 직원 버튼 클릭
    employeeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModalComponent(EmployeeSystem);
    });

    // 인벤토리 버튼 클릭
    inventoryBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModalComponent(InventorySystem);
    })

    // 납품업체 버튼 클릭
    supplyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModalComponent(SupplySystem);
    })

    // 외부 클릭 시 submenu 닫기
    document.addEventListener('click', (e) => {
      const isClickInside = this.$target.contains(e.target);
      const isSubmenuVisible = submenuContainer.style.display === 'block';

      if (!isClickInside && isSubmenuVisible) {
        submenuContainer.style.display = 'none';
      }
    });
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
}