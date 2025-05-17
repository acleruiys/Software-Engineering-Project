import Component from "./Component.js";

export default class FooterPanel extends Component {
    setup() {
        this.state = {
            userInf: [
                { label: "회원번호", value: "A920945" },
                { label: "회원명", value: "홍길동" },
                { label: "잔여포인트", value: "13,200P" }
            ],
            leftButtons: ["회원 검색", "반품"],
            centerButtons: [
                "주방메모", "포장", "배달", "서비스", "할인",
                "수표조회", "영수증", "주문보류", "요청사항", "기타"
            ],
            rightButtons: ["분할/복합", "포인트", "현금", "카드"]
        };
    }

    template() {
        return `
      <div class="footer">
        <div class="user-inf">
          ${this.state.userInf.map(info => `
            <div class="user-label">${info.label}</div>
            <div class="user-value">${info.value}</div>
          `).join("")}
        </div>
        ${this.state.leftButtons.map(label => `<div class="footer-button">${label}</div>`).join("")}
        <div class="footer-center-buttons">
          ${this.state.centerButtons.map(label => `<div class="footer-center-button">${label}</div>`).join("")}
        </div>
        ${this.state.rightButtons.map(label => `<div class="footer-button">${label}</div>`).join("")}
      </div>
    `;
    }

    setEvent() {
        this.$target.querySelectorAll(".footer-button").forEach(btn => {
            btn.addEventListener("click", () => {
                alert(`'${btn.textContent}' 버튼이 클릭되었습니다.`);
            });
        });
    }
}