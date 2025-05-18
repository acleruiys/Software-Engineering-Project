import Component from "./Component.js";
import MemberPopupManager from "../member/MemberPopupManager.js";

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
            rightButtons: ["분할", "복합", "현금", "카드"]
        };
        
        // 회원 검색 팝업 매니저 생성
        // 컴포넌트가 마운트된 후에 생성하기 위해 mounted 메서드로 이동
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
        ${this.state.leftButtons.map(label => `<div class="footer-button" data-action="${label}">${label}</div>`).join("")}
        <div class="footer-center-buttons">
          ${this.state.centerButtons.map(label => `<div class="footer-center-button">${label}</div>`).join("")}
        </div>
        ${this.state.rightButtons.map(label => `<div class="footer-button">${label}</div>`).join("")}
      </div>
    `;
    }

    mounted() {
        // 회원 검색 팝업 매니저 생성 (컴포넌트 렌더링 후에 생성)
        this.memberPopupManager = new MemberPopupManager({
            target: document.querySelector('#memberPopupContainer')
        });
    }

    setEvent() {
        this.$target.querySelectorAll(".footer-button").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const action = e.target.dataset.action;
                
                // 회원 검색 버튼 클릭 시
                if (action === '회원 검색') {
                    // 회원 검색 팝업 열기
                    this.memberPopupManager.openPopup();
                } else {
                    alert(`'${btn.textContent}' 버튼이 클릭되었습니다.`);
                }
            });
        });
        
        // 센터 버튼에 대한 이벤트 리스너
        this.$target.querySelectorAll(".footer-center-button").forEach(btn => {
            btn.addEventListener("click", () => {
                alert(`'${btn.textContent}' 버튼이 클릭되었습니다.`);
            });
        });
    }
}